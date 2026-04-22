from fastapi import APIRouter
from google import genai

router = APIRouter()

# 🔑 use your working key
client = genai.Client(api_key="AIzaSyCr83gkVYj2U7mfcsASuNfp6tWRgjhReEY")

@router.post("/chat")
def chat(query: str):
    try:
        prompt = f"""
        You are Krishimitra, an AI agriculture assistant.

        Rules:
        - Reply in SAME language as user
        - Use simple farmer-friendly language
        - Give practical advice
        - Keep answer short (3-5 lines)

        Question:
        {query}
        """

        response = client.models.generate_content(
            model="models/gemini-flash-latest",
            contents=prompt
        )

        return {
            "status": "success",
            "data": {
                "response": response.text
            }
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }