from fastapi import APIRouter
from google import genai
import json
import re

router = APIRouter()

client = genai.Client(api_key="YOUR_GEMINI_API_KEY")

@router.get("/schemes")
def get_schemes(state: str, crop: str, land: str, income: str):

    data = []

    try:
        prompt = f"""
You are an agriculture advisor.

Suggest 6 BEST government schemes and loans for a farmer.

Farmer Details:
State: {state}
Crop: {crop}
Land: {land}
Income: {income}

IMPORTANT:
- Recommendations MUST change based on input
- Prefer schemes relevant to the STATE
- Prefer schemes useful for the CROP
- Include loans, insurance, subsidies
- At least 3 must be LOANS
- Avoid always repeating PM-KISAN unless relevant

Return ONLY JSON:

[
  {{
    "name": "",
    "benefit": "",
    "eligibility": "",
    "why": "Explain based on farmer details",
    "link": ""
  }}
]
"""

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        text = response.text
        print("RAW:", text)

        text = text.replace("```json", "").replace("```", "").strip()

        try:
            data = json.loads(text)
        except:
            match = re.search(r"\[.*\]", text, re.DOTALL)
            if match:
                data = json.loads(match.group())

    except Exception as e:
        print("ERROR:", e)

    # 🔥 fallback (dynamic)
    if not data:
        data = [
            {
                "name": f"KCC Loan ({state})",
                "benefit": "Low interest crop loan",
                "eligibility": "Farmers",
                "why": f"Useful for {crop} farming in {state}",
                "link": "https://www.nabard.org"
            },
            {
                "name": f"{crop} Crop Insurance",
                "benefit": "Protection from crop loss",
                "eligibility": "All farmers",
                "why": f"Protects {crop} from weather risks",
                "link": "https://pmfby.gov.in"
            }
        ]

    return {
        "status": "success",
        "data": data
    }