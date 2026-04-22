from google import genai

client = genai.Client(api_key="AIzaSyCr83gkVYj2U7mfcsASuNfp6tWRgjhReEY")

response = client.models.generate_content(
    model="models/gemini-flash-latest",   # ✅ correct model
    contents="Hello"
)

print(response.text)