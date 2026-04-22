from fastapi import APIRouter, File, UploadFile
from PIL import Image
import io
import torch
import torchvision.transforms as transforms
import torchvision.models as models
from google import genai

router = APIRouter()

# 🔑 Gemini
client = genai.Client(api_key="AIzaSyCr83gkVYj2U7mfcsASuNfp6tWRgjhReEY")

# 📦 Load classes
with open("classes.txt") as f:
    classes = [line.strip() for line in f]

# 🧠 Load trained model
model = models.resnet18()
model.fc = torch.nn.Linear(model.fc.in_features, len(classes))
model.load_state_dict(torch.load("plant_model.pth", map_location="cpu"))
model.eval()

# 🔄 Transform
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# ⚠️ Severity logic
def get_severity(conf):
    if conf > 0.85:
        return "Severe ⚠️"
    elif conf > 0.6:
        return "Moderate ⚡"
    else:
        return "Early Stage 🌱"

@router.post("/detect-disease")
async def detect_disease(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    img = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(img)
        probs = torch.nn.functional.softmax(output, dim=1)
        confidence, pred = torch.max(probs, 1)

    disease = classes[pred.item()]
    confidence_val = confidence.item()
    severity = get_severity(confidence_val)

    # 🤖 Gemini explanation
    prompt = f"""
Disease: {disease}
Severity: {severity}

Explain in very simple farmer-friendly language.

IMPORTANT:
- Do NOT use markdown symbols like #, *, **
- Use simple headings like:
  1. What is disease
  2. Causes
  3. Treatment
  4. Medicines
  5. Prevention
- Keep it clean and easy to read
- Use bullet points with '-' only
"""

    response = client.models.generate_content(
        model="models/gemini-flash-latest",
        contents=prompt
    )

    return {
        "status": "success",
        "data": {
            "disease": disease,
            "confidence": round(confidence_val, 2),
            "severity": severity,
            "explanation": response.text
        }
    }