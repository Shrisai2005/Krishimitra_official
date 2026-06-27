from fastapi import APIRouter
import requests

router = APIRouter()

API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"  # 🔑 Replace with NEW key

@router.get("/weather")
def get_weather(city: str):
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"

    try:
        res = requests.get(url)
        data = res.json()

        print("API RESPONSE:", data)  # 🔥 DEBUG (very important)

        # ✅ FIXED CHECK (handles both int and string)
        if data.get("cod") not in [200, "200"]:
            return {
                "status": "error",
                "message": data.get("message", "City not found")
            }

        forecast = []

        # ✅ Get 5 days (every 24 hours)
        for i in range(0, 40, 8):
            item = data["list"][i]

            condition = item["weather"][0]["description"]
            temp = item["main"]["temp"]
            humidity = item["main"]["humidity"]
            # 🌾 Smart farming advice
            if "rain" in condition.lower():
                advice = "🌧️ Rain expected - avoid pesticide spraying and ensure proper drainage"
            elif temp > 35:
                advice = "☀️ High heat - irrigate crops morning/evening"
            elif humidity > 70:
                advice = "💧 High humidity - risk of fungal diseases. Avoid overwatering and monitor leaves for spots."
            else:
                advice = "🌱 Good weather for farming"

            forecast.append({
                "date": item["dt_txt"].split(" ")[0],
                "temp": temp,
                "humidity": item["main"]["humidity"],
                "condition": condition,
                "advice": advice
            })

        return {
            "status": "success",
            "data": forecast
        }

    except Exception as e:
        print("ERROR:", e)
        return {
            "status": "error",
            "message": "Something went wrong"
        }