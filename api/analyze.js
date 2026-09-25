export default function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  const message = (request.body?.message || "").trim();

  if (!message) {
    return response.status(400).json({
      error: "Please enter a message",
    });
  }

  const text = message.toLowerCase();

  const scamPatterns = {
    otp: ["otp", "one time password", "verification code"],
    payment: [
      "pay",
      "payment",
      "send money",
      "transfer money",
      "registration fee",
      "processing fee",
      "advance payment",
    ],
    prize: [
      "you won",
      "winner",
      "lottery",
      "prize",
      "reward",
    ],
    job: [
      "job offer",
      "job selected",
      "work from home",
      "registration fee",
      "job fee",
    ],
    account: [
      "account blocked",
      "account suspended",
      "verify your account",
      "kyc",
      "bank account",
    ],
    urgency: [
      "urgent",
      "immediately",
      "act now",
      "within 24 hours",
      "limited time",
    ],
    link: [
      "click here",
      "click the link",
      "open this link",
      "verify here",
    ],
  };

  const warning_signs = [];
  const detected_categories = [];

  for (const [category, keywords] of Object.entries(scamPatterns)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      detected_categories.push(category);

      const warnings = {
        otp: "The message asks for or mentions an OTP or verification code.",
        payment: "The message involves a payment, fee, or money transfer.",
        prize: "The message claims you have won a prize or reward.",
        job: "The message contains a job-related offer or fee request.",
        account:
          "The message creates concern about an account or KYC verification.",
        urgency:
          "The message uses urgency or pressure to make you act quickly.",
        link: "The message asks you to click or open a link.",
      };

      warning_signs.push(warnings[category]);
    }
  }

  let score = detected_categories.length * 15;

  if (detected_categories.includes("otp")) score += 25;
  if (detected_categories.includes("payment")) score += 20;
  if (detected_categories.includes("prize")) score += 15;
  if (detected_categories.includes("urgency")) score += 10;

  score = Math.min(score, 100);

  let risk_level;
  let analysis;

  if (score >= 70) {
    risk_level = "High Risk";
    analysis =
      "This message contains multiple warning signs commonly associated with scam or fraud attempts.";
  } else if (score >= 40) {
    risk_level = "Medium Risk";
    analysis =
      "This message contains some suspicious patterns. Verify the sender and request before taking any action.";
  } else if (score > 0) {
    risk_level = "Low Risk";
    analysis =
      "A few potentially suspicious patterns were detected. Continue carefully and verify important requests.";
  } else {
    risk_level = "No Major Warning Signs";
    analysis =
      "No major scam-related patterns were detected by the current rule-based scanner. This does not guarantee that the message is safe.";
  }

  const safety_tips = [
    "Never share OTPs, passwords, PINs, or verification codes.",
    "Do not send money just because a message creates urgency.",
    "Verify the sender using an official website or trusted contact.",
    "Avoid clicking suspicious links.",
    "If a job requires an upfront payment, verify the company independently.",
  ];

  return response.status(200).json({
    status: "success",
    message,
    risk_level,
    risk_score: score,
    analysis,
    warning_signs,
    safety_tips,
    detected_categories,
  });
}
