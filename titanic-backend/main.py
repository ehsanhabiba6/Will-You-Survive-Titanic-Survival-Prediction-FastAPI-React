from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Load the trained model and feature names
model = joblib.load(os.path.join(os.path.dirname(__file__), "titanic_model.pkl"))

# Define the input schema
class Passenger(BaseModel):
    Pclass: int
    Sex: str         # "male" or "female"
    Age: float
    Parch: int
    Fare: float
    Embarked: str    # "S", "C", or "Q"
    Title: str       # e.g. "Mr", "Miss", "Mrs", "Master", "Rare"
    FamilySize: int
    is_alone:int

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:3000"] for stricter control
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
def predict_survival(data: Passenger):
    # Encode categorical variables
    sex = 0 if data.Sex.lower() == "male" else 1
    embarked_S = 1 if data.Embarked.upper() == "S" else 0

    # Convert title to numeric (as per model training)
    title_map = {"Mr": 1, "Miss": 2, "Mrs": 3, "Master": 4, "Rare": 5}
    title = title_map.get(data.Title, 0)

    is_alone = 1 if data.FamilySize == 1 else 0

    # Final feature list: match training columns
    model_input = [[
        data.Pclass,
        sex,
        data.Age,
        data.Parch,
        data.Fare,
        embarked_S,
        title,
        data.FamilySize,
        is_alone,
    ]]

    prediction = model.predict(model_input)[0]
    result = "Survived" if prediction == 1 else "Did not survive"
    return {"prediction": result}