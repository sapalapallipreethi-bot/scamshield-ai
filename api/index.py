from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="ScamShield AI API")


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

    text = message.lower()

    scam_patterns = {
        "otp": ["otp", "one time password", "verification code"],
        "payment": [
            "pay",
            "payment",
            "send money",
            "transfer money",
            "registration fee",
            "processing fee",
            "advance payment",
        ],
        "prize": [
            "you won",
            "winner",
            "lottery",
            "prize",
            "reward",
        ],
        "job": [
            "job offer",
            "job selected",
            "work from home",
            "registration fee",
            "job fee",
        ],
        "account": [
            "account blocked",
            "account suspended",
            "verify your account",
            "kyc",
            "bank account",
        ],
        "urgency": [
            "urgent",
            "immediately",
            "act now",
            "within 24 hours",
            "limited time",
        ],
        "link": [
            "click here",
            "click the link",
            "open this link",
            "verify here",
        ],
    }

    warning_signs = []
    matched_categories = []

    for category, keywords in scam_patterns.items():
        matches = [keyword for keyword in keywords if keyword in text]

        if matches:
            matched_categories.append(category)

            if category == "otp":
                warning_signs.append(
                    "The message asks for or mentions an OTP or verification code."
                )
            elif category == "payment":
                warning_signs.append(
                    "The message involves a payment, fee, or money transfer."
                )
            elif category == "prize":
                warning_signs.append(
                    "The message claims you have won a prize or reward."
                )
            elif category == "job":
                warning_signs.append(
                    "The message contains a job-related offer or fee request."
                )
            elif category == "account":
                warning_signs.append(
                    "The message creates concern about an account or KYC verification."
                )
            elif category == "urgency":
                warning_signs.append(
                    "The message uses urgency or pressure to make you act quickly."
                )
            elif category == "link":
                warning_signs.append(
                    "The message asks you to click or open a link."
                )

    score = len(matched_categories) * 15

    if "otp" in matched_categories:
        score += 25

    if "payment" in matched_categories:
        score += 20

    if "prize" in matched_categories:
        score += 15

    if "urgency" in matched_categories:
        score += 10

    score = min(score, 100)

    if score >= 70:
        risk_level = "High Risk"
        analysis = (
            "This message contains multiple warning signs commonly associated "
            "with scam or fraud attempts."
        )
    elif score >= 40:
        risk_level = "Medium Risk"
        analysis = (
            "This message contains some suspicious patterns. "
            "Verify the sender and request before taking any action."
        )
    elif score > 0:
        risk_level = "Low Risk"
        analysis = (
            "A few potentially suspicious patterns were detected. "
            "Continue carefully and verify important requests."
        )
    else:
        risk_level = "No Major Warning Signs"
        analysis = (
            "No major scam-related patterns were detected by the current "
            "rule-based scanner. This does not guarantee that the message is safe."
        )

    safety_tips = [
        "Never share OTPs, passwords, PINs, or verification codes.",
        "Do not send money just because a message creates urgency.",
        "Verify the sender using an official website or trusted contact.",
        "Avoid clicking suspicious links.",
        "If a job requires an upfront payment, verify the company independently.",
    ]

    return {
        "status": "success",
        "message": message,
        "risk_level": risk_level,
        "risk_score": score,
        "analysis": analysis,
        "warning_signs": warning_signs,
        "safety_tips": safety_tips,
        "detected_categories": matched_categories,
    }
