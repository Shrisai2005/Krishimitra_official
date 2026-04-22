from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chatbot, disease, weather, schemes, market

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chatbot.router, prefix="/api")
app.include_router(disease.router, prefix="/api")
app.include_router(weather.router, prefix="/api")
app.include_router(schemes.router, prefix="/api")
app.include_router(market.router, prefix="/api")
@app.get("/")
def home():
    return {"message": "Krishimitra Running 🚀"}