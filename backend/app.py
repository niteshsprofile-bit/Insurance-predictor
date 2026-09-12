from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
from auth import register_user, login_user, verify_token, save_prediction, get_user_history
from model import model

# Create FastAPI app
app = FastAPI(
    title="Medical Insurance Predictor API",
    version="2.0.0",
    description="Full-stack insurance prediction system"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== MODELS ====================

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str


class LoginRequest(BaseModel):
    email: str
    password: str


class InsuranceInput(BaseModel):
    age: int
    gender: str
    height: float
    weight: float
    blood_pressure: float
    sugar_level: float
    children: int
    smoker: bool
    region: str
    previous_medical_history: Optional[str] = None
    family_medical_history: Optional[str] = None


# ==================== ENDPOINTS ====================

@app.get("/")
async def home():
    """Health check endpoint."""
    return {
        "message": "Medical Insurance Predictor API",
        "version": "2.0.0",
        "status": "running"
    }


@app.post("/auth/register")
async def register(data: RegisterRequest):
    """Register new user."""
    try:
        result = register_user(data.email, data.password[:72], data.full_name)
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["message"])
        return {"status": "success", "message": result["message"], "user_id": result["user_id"]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/auth/login")
async def login(data: LoginRequest):
    """Login user and get token."""
    try:
        result = login_user(data.email, data.password[:72])
        if not result["success"]:
            raise HTTPException(status_code=401, detail=result["message"])
        return {
            "status": "success",
            "token": result["token"],
            "user_id": result["user_id"],
            "email": result["email"],
            "full_name": result["full_name"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/auth/verify")
async def verify(authorization: str = Header(None)):
    """Verify token."""
    try:
        if not authorization:
            raise HTTPException(status_code=401, detail="No token provided")
        
        token = authorization.replace("Bearer ", "")
        payload = verify_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        return {
            "status": "success",
            "user_id": payload.get("user_id"),
            "email": payload.get("email")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@app.post("/predict")
async def predict_insurance(input_data: InsuranceInput, authorization: str = Header(None)):
    """Predict insurance charges."""
    try:
        user_id = None
        if authorization:
            try:
                token = authorization.replace("Bearer ", "")
                payload = verify_token(token)
                user_id = payload.get("user_id") if payload else None
            except:
                pass
        
        height_m = input_data.height / 100.0
        bmi = input_data.weight / (height_m ** 2) if height_m > 0 else 0.0

        data = {
            "age": input_data.age,
            "gender": input_data.gender,
            "height": input_data.height,
            "weight": input_data.weight,
            "blood_pressure": input_data.blood_pressure,
            "sugar_level": input_data.sugar_level,
            "children": input_data.children,
            "smoker": input_data.smoker,
            "region": input_data.region,
            "previous_medical_history": input_data.previous_medical_history or "",
            "family_medical_history": input_data.family_medical_history or "",
        }

        prediction = model.predict(data)

        if user_id:
            data["bmi"] = bmi
            save_prediction(user_id, data, prediction)

        return {
            "predicted_charges": round(prediction, 2),
            "bmi": round(bmi, 2),
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/history")
async def get_history(authorization: str = Header(None)):
    """Get prediction history."""
    try:
        if not authorization:
            raise HTTPException(status_code=401, detail="No token provided")
        
        token = authorization.replace("Bearer ", "")
        payload = verify_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user_id = payload.get("user_id")
        result = get_user_history(user_id)
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["message"])
        
        return {"status": "success", "data": result["data"]}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
