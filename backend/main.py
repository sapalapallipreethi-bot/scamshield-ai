from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="ScamShield AI API")

# Allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScanRequest(BaseModel):
    message: str

@app.get("/")
def home():
    return {"message": "ScamShield AI Backend is running!"}

@app.post("/analyze")
def analyze_message(request: ScanRequest):
    message = request.message.strip()

    if not message:
        return {"error": "Please enter a message"}

    # Temporary demo logic — AI is not connected yet
    return {
        "status": "success",
        "message": message,
        "risk_level": "Under Review",
        "analysis": "Demo analysis only. Real AI analysis is not connected yet.",
        "warning_signs": [],
        "safety_tips": [
            "Never share OTPs or passwords.",
            "Verify the sender before making payments."
        ]
    }