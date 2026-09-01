import torch
import numpy as np
import os
import base64
import io

from PIL import Image
from torchvision import models, transforms
from torch import nn

from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from pytorch_grad_cam.utils.image import show_cam_on_image


# ============================================================
# DEVICE
# ============================================================

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("Ultrasound model device:", device)


# ============================================================
# LOAD RESNET50
# ============================================================

model = None

model_path = os.path.join(
    os.path.dirname(__file__),
    "best_ultrasound_resnet50.pth"
)


def get_ultrasound_model():

    global model

    if model is None:

        print("Loading Ultrasound ResNet50...")

        model = models.resnet50(weights=None)

        model.fc = nn.Linear(
            model.fc.in_features,
            2
        )

        model.load_state_dict(
            torch.load(
                model_path,
                map_location=device
            )
        )

        model = model.to(device)
        model.eval()

        print("Ultrasound ResNet50 loaded successfully!")

    return model

# ============================================================
# IMAGE TRANSFORM
# ============================================================

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.Grayscale(num_output_channels=3),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# ============================================================
# PREDICT + GRAD-CAM
# ============================================================

def predict_ultrasound(image: Image.Image):

    model = get_ultrasound_model()

    # --------------------------------------------------------
    # PREPARE IMAGE
    # --------------------------------------------------------

    original_image = image.convert("RGB")

    input_tensor = transform(
        original_image
    ).unsqueeze(0).to(device)


    # --------------------------------------------------------
    # PREDICTION
    # --------------------------------------------------------

    with torch.no_grad():

        output = model(
            input_tensor
        )

        probabilities = torch.softmax(
            output,
            dim=1
        )

        predicted_class = torch.argmax(
            probabilities,
            dim=1
        ).item()


    # --------------------------------------------------------
    # CLASS MAPPING
    # --------------------------------------------------------

    if predicted_class == 0:
        result = "PCOS"
    else:
        result = "Non-PCOS"


    # --------------------------------------------------------
    # PROBABILITIES
    # --------------------------------------------------------

    pcos_probability = (
        probabilities[0][0].item()
        * 100
    )

    non_pcos_probability = (
        probabilities[0][1].item()
        * 100
    )


    # --------------------------------------------------------
    # GRAD-CAM
    # --------------------------------------------------------

    target_layers = [
        model.layer4[-1]
    ]

    cam = GradCAM(
        model=model,
        target_layers=target_layers
    )

    targets = [
        ClassifierOutputTarget(
            predicted_class
        )
    ]

    grayscale_cam = cam(
        input_tensor=input_tensor,
        targets=targets
    )[0]


    # --------------------------------------------------------
    # ORIGINAL IMAGE
    # --------------------------------------------------------

    rgb_image = np.array(
        original_image.resize(
            (224, 224)
        )
    ).astype(
        np.float32
    ) / 255.0


    # --------------------------------------------------------
    # GRAD-CAM OVERLAY
    # --------------------------------------------------------

    visualization = show_cam_on_image(
        rgb_image,
        grayscale_cam,
        use_rgb=True
    )


    # --------------------------------------------------------
    # NUMPY IMAGE → PNG → BASE64
    # --------------------------------------------------------

    visualization_image = Image.fromarray(
    visualization.astype(np.uint8)
)

    image_buffer = io.BytesIO()

    visualization_image.save(
        image_buffer,
        format="PNG"
    )

    gradcam_base64 = base64.b64encode(
        image_buffer.getvalue()
    ).decode("utf-8")


    # --------------------------------------------------------
    # FINAL RESPONSE
    # --------------------------------------------------------

    return {
    "prediction": int(predicted_class),
    "result": str(result),
    "pcos_probability": float(
        round(pcos_probability, 2)
    ),
    "non_pcos_probability": float(
        round(non_pcos_probability, 2)
    ),
    "gradcam": str(gradcam_base64)
}