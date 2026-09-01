from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import shap
import numpy as np
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException
from fastapi import UploadFile, File
from PIL import Image
import io
import sys
from passlib.context import CryptContext
from jose import jwt
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from fastapi.security import OAuth2PasswordRequestForm

# Allow Python to access the sibling ultrasound_model folder
PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)

sys.path.insert(0, PROJECT_ROOT)

from ultrasound_model.ultrasound import predict_ultrasound

app = FastAPI()

# ============================================================
# MONGODB
# ============================================================

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

db = client["ovalens"]

predictions_collection = db["predictions"]

# Configure CORS origins. Use `ALLOWED_ORIGINS` env var (comma-separated)
default_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    # merge and strip
    env_list = [o.strip() for o in env_origins.split(",") if o.strip()]
    allow_origins = list(dict.fromkeys(default_origins + env_list))
else:
    allow_origins = default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

users_collection = db["users"]

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "ovalens-development-secret"
)

ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


# ============================================================
# LOAD MODEL
# ============================================================

model = joblib.load("best_pcos_clinical_model.pkl")

# Random Forest inside pipeline
rf_classifier = model.named_steps["model"]

# Imputer inside pipeline
imputer = model.named_steps["imputer"]

# SHAP explainer
explainer = shap.TreeExplainer(rf_classifier)

def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str):
    return pwd_context.verify(
        password,
        hashed_password
    )


def create_access_token(user_id: str):
    return jwt.encode(
        {"user_id": user_id},
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def get_current_user(
    token: str = Depends(oauth2_scheme)
):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token"
            )

        user = users_collection.find_one(
            {"_id": ObjectId(user_id)}
        )

        if user is None:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        return user

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )


# ============================================================
# PATIENT INPUT
# ============================================================
class SignupData(BaseModel):
    name: str
    email: str
    password: str


class LoginData(BaseModel):
    email: str
    password: str

class PatientData(BaseModel):

    Age_yrs: float | None = None
    Weight_Kg: float | None = None
    HeightCm: float | None = None
    BMI: float | None = None
    Blood_Group: float | None = None
    Pulse_ratebpm: float | None = None
    RR_breaths_min: float | None = None
    Hbg_dl: float | None = None

    CycleR_I: float | None = None
    Cycle_lengthdays: float | None = None
    Marraige_Status_Yrs: float | None = None
    PregnantY_N: float | None = None
    No_of_aborptions: float | None = None

    I_beta_HCG: float | None = None
    II_beta_HCG: float | None = None

    FSHmIU_mL: float | None = None
    LHmIU_mL: float | None = None
    FSH_LH: float | None = None

    Hipinch: float | None = None
    Waistinch: float | None = None
    Waist_Hip_Ratio: float | None = None

    TSH_mIU_L: float | None = None
    AMHng_mL: float | None = None
    PRLng_mL: float | None = None
    Vit_D3_ng_mL: float | None = None
    PRGng_mL: float | None = None
    RBSmg_dl: float | None = None

    Weight_gainY_N: float | None = None
    hair_growthY_N: float | None = None
    Skin_darkening_Y_N: float | None = None
    Hair_lossY_N: float | None = None
    PimplesY_N: float | None = None
    Fast_foodY_N: float | None = None
    Reg_ExerciseY_N: float | None = None

    BP_Systolic_mmHg: float | None = None
    BP_Diastolic_mmHg: float | None = None

    Follicle_No_L: float | None = None
    Follicle_No_R: float | None = None

    Avg_F_size_L_mm: float | None = None
    Avg_F_size_R_mm: float | None = None

    Endometrium_mm: float | None = None


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    client.admin.command("ping")

    return {
        "message": "OVALENS Backend is running!",
        "mongodb": "connected"
    }

# ============================================================
# AUTHENTICATION
# ============================================================

@app.post("/auth/signup")
def signup(data: SignupData):

    existing_user = users_collection.find_one({
        "email": data.email.lower()
    })

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user = {
        "name": data.name,
        "email": data.email.lower(),
        "password_hash": hash_password(data.password),
        "created_at": datetime.utcnow()
    }

    result = users_collection.insert_one(user)

    return {
        "message": "Account created successfully",
        "id": str(result.inserted_id)
    }


@app.post("/auth/login")
def login(
    data: OAuth2PasswordRequestForm = Depends()
):

    user = users_collection.find_one({
        "email": data.username.lower()
    })

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        data.password,
        user["password_hash"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(
        str(user["_id"])
    )

    return {
    "message": "Login successful",
    "access_token": token,
    "token_type": "bearer",
    "user": {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"]
    }
}

# ============================================================
# PREDICT
# ============================================================

@app.post("/predict")
def predict(
    data: PatientData,
    current_user=Depends(get_current_user)
):

    

    # ========================================================
    # CREATE INPUT DATAFRAME
    # ========================================================

    input_data = pd.DataFrame([{

        "Age_yrs": data.Age_yrs,
        "Weight_Kg": data.Weight_Kg,
        "HeightCm": data.HeightCm,
        "BMI": data.BMI,
        "Blood_Group": data.Blood_Group,

        "Pulse_ratebpm": data.Pulse_ratebpm,
        "RR_breaths/min": data.RR_breaths_min,
        "Hbg/dl": data.Hbg_dl,

        "CycleR/I": data.CycleR_I,
        "Cycle_lengthdays": data.Cycle_lengthdays,

        "Marraige_Status_Yrs":
            data.Marraige_Status_Yrs,

        "PregnantY/N":
            data.PregnantY_N,

        "No._of_aborptions":
            data.No_of_aborptions,

        "I___beta-HCGmIU/mL":
            data.I_beta_HCG,

        "II____beta-HCGmIU/mL":
            data.II_beta_HCG,

        "FSHmIU/mL":
            data.FSHmIU_mL,

        "LHmIU/mL":
            data.LHmIU_mL,

        "FSH/LH":
            data.FSH_LH,

        "Hipinch":
            data.Hipinch,

        "Waistinch":
            data.Waistinch,

        "Waist:Hip_Ratio":
            data.Waist_Hip_Ratio,

        "TSH_mIU/L":
            data.TSH_mIU_L,

        "AMHng/mL":
            data.AMHng_mL,

        "PRLng/mL":
            data.PRLng_mL,

        "Vit_D3_ng/mL":
            data.Vit_D3_ng_mL,

        "PRGng/mL":
            data.PRGng_mL,

        "RBSmg/dl":
            data.RBSmg_dl,

        "Weight_gainY/N":
            data.Weight_gainY_N,

        "hair_growthY/N":
            data.hair_growthY_N,

        "Skin_darkening_Y/N":
            data.Skin_darkening_Y_N,

        "Hair_lossY/N":
            data.Hair_lossY_N,

        "PimplesY/N":
            data.PimplesY_N,

        "Fast_food_Y/N":
            data.Fast_foodY_N,

        "Reg.ExerciseY/N":
            data.Reg_ExerciseY_N,

        "BP__Systolic_mmHg":
            data.BP_Systolic_mmHg,

        "BP__Diastolic_mmHg":
            data.BP_Diastolic_mmHg,

        "Follicle_No._L":
            data.Follicle_No_L,

        "Follicle_No._R":
            data.Follicle_No_R,

        "Avg._F_size_L_mm":
            data.Avg_F_size_L_mm,

        "Avg._F_size_R_mm":
            data.Avg_F_size_R_mm,

        "Endometrium_mm":
            data.Endometrium_mm,

        # Model expects this 42nd feature
        "Unnamed:_44": np.nan

    }])


    # ========================================================
    # CONVERT NONE → NaN
    # ========================================================

    input_data = input_data.replace(
        {None: np.nan}
    )


    # ========================================================
    # PREDICTION
    # ========================================================

    prediction = model.predict(input_data)[0]

    probability = model.predict_proba(
        input_data
    )[0][1]


    # ========================================================
    # SHAP EXPLANATION
    # ========================================================

    # Apply the same imputation used by model
    input_processed = imputer.transform(
        input_data
    )


    # Calculate SHAP values
    shap_values = explainer.shap_values(
        input_processed
    )


    # ========================================================
    # HANDLE SHAP OUTPUT FORMAT
    # ========================================================

    if isinstance(shap_values, list):

        shap_pcos = shap_values[1][0]

    else:

        shap_array = np.array(
            shap_values
        )

        if shap_array.ndim == 3:

            shap_pcos = shap_array[0, :, 1]

        else:

            shap_pcos = shap_array[0]


    # ========================================================
    # FEATURE EXPLANATIONS
    # ========================================================

    explanations = []

    for feature, value, shap_value in zip(
        input_data.columns,
        input_processed[0],
        shap_pcos
    ):

        explanations.append({

            "feature": feature,

            "value": float(value),

            "impact": round(
                float(shap_value),
                6
            ),

            "direction": (
                "towards PCOS"
                if shap_value > 0
                else "towards Non-PCOS"
            )
        })


    # ========================================================
    # SORT BY STRONGEST IMPACT
    # ========================================================

    explanations = sorted(
        explanations,
        key=lambda x: abs(x["impact"]),
        reverse=True
    )


    # Top 10 SHAP features
    top_explanations = explanations[:10]


    # ========================================================
    # FINAL RESULT
    # ========================================================

    result = {
        "prediction": int(prediction),
        "result": (
            "PCOS"
            if prediction == 1
            else "Non-PCOS"
        ),
        "pcos_probability": round(
            float(probability) * 100,
            2
        ),
        "explanation": top_explanations
    }


    # ========================================================
    # SAVE TO MONGODB
    # ========================================================

    history_document = {
    **result,
    "user_id": str(current_user["_id"]),
    "created_at": datetime.utcnow()
}

    insert_result = predictions_collection.insert_one(
        history_document
    )

    result["id"] = str(
    insert_result.inserted_id
)


        # ========================================================
    # RETURN RESPONSE
    # ========================================================

    return result


# ============================================================
# HISTORY
# ============================================================

@app.get("/history")
def get_history(
    current_user=Depends(get_current_user)
):

    records = list(
        predictions_collection
        .find({
            "user_id": str(current_user["_id"])
        })
        .sort("created_at", -1)
    )

    history = []

    for record in records:

        history.append({
            "id": str(record["_id"]),
            "created_at": record["created_at"].isoformat(),
            "prediction": record["prediction"],
            "result": record["result"],
            "pcos_probability": record["pcos_probability"],
            "explanation": record["explanation"]
        })

    return {
        "history": history
    }

# ============================================================
# SINGLE HISTORY RESULT
# ============================================================

@app.get("/history/{analysis_id}")
def get_single_history(
    analysis_id: str,
    current_user=Depends(get_current_user)
):

    try:
        record = predictions_collection.find_one(
    {
        "_id": ObjectId(analysis_id),
        "user_id": str(current_user["_id"])
    }
)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid analysis ID"
        )

    if record is None:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )

    return {
    "id": str(record["_id"]),
    "created_at": record["created_at"].isoformat(),

    "prediction":
        record["prediction"],

    "result":
        record["result"],

    "pcos_probability":
        record["pcos_probability"],

    "explanation":
        record["explanation"],

    "ultrasound":
        record.get("ultrasound", None)
}
    # ============================================================
# ULTRASOUND PREDICTION
# ============================================================

@app.post("/ultrasound/predict")
async def ultrasound_predict(
    analysis_id: str,
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):

    try:

        # ----------------------------------------------------
        # CHECK ANALYSIS ID
        # ----------------------------------------------------

        try:
            object_id = ObjectId(analysis_id)

        except Exception:
            raise HTTPException(
                status_code=400,
                detail="Invalid analysis ID"
            )


        # ----------------------------------------------------
        # CHECK EXISTING CLINICAL ANALYSIS
        # ----------------------------------------------------

        existing_record = predictions_collection.find_one(
    {
        "_id": object_id,
        "user_id": str(current_user["_id"])
    }
)

        if existing_record is None:
            raise HTTPException(
                status_code=404,
                detail="Clinical analysis not found"
            )


        # ----------------------------------------------------
        # READ IMAGE
        # ----------------------------------------------------

        image_bytes = await file.read()

        image = Image.open(
            io.BytesIO(image_bytes)
        )


        # ----------------------------------------------------
        # RUN RESNET50 + GRAD-CAM
        # ----------------------------------------------------

        ultrasound_result = predict_ultrasound(
            image
        )


        # ----------------------------------------------------
        # SAVE ULTRASOUND RESULT
        # INTO SAME MONGODB DOCUMENT
        # ----------------------------------------------------

        ultrasound_document = {

            "prediction":
                int(
                    ultrasound_result["prediction"]
                ),

            "result":
                str(
                    ultrasound_result["result"]
                ),

            "pcos_probability":
                float(
                    ultrasound_result[
                        "pcos_probability"
                    ]
                ),

            "non_pcos_probability":
                float(
                    ultrasound_result[
                        "non_pcos_probability"
                    ]
                ),

            "gradcam":
                str(
                    ultrasound_result["gradcam"]
                )
        }


        predictions_collection.update_one(
            {"_id": object_id},
            {
                "$set": {
                    "ultrasound":
                        ultrasound_document
                }
            }
        )


        # ----------------------------------------------------
        # RETURN RESULT
        # ----------------------------------------------------

        return {
            **ultrasound_result,
            "analysis_id":
                analysis_id
        }


    except HTTPException:
        raise


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Ultrasound prediction failed: "
                f"{str(e)}"
            )
        )