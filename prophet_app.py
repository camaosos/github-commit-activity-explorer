"""
Prophet microservice in FastAPI
"""
import os
import pandas as pd

from datetime import date, timedelta
from prophet import Prophet
from github import Github, Auth
from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()
app = FastAPI()
auth = Auth.Token(os.getenv("REACT_APP_AUTH_TOKEN"))
g = Github(auth=auth)
WEEKS_AHEAD = 12

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Repo(BaseModel):
    """
    Repo Class
    """
    repo: str


@app.post('/predict')
def predict(repo: Repo):
    """
    Predict endpoint
    """
    m = Prophet(yearly_seasonality=10)
    weeks = g.get_repo(repo.repo).get_stats_participation()
    weeks_dict = [{"ds": date.today() - timedelta(weeks=51-index), "y": value} 
                  for (index, value) in enumerate(weeks.all)]
    weeks_df = pd.DataFrame.from_records(weeks_dict)
    weeks_df["cap"] = 0.0
    m.fit(weeks_df)
    future = m.make_future_dataframe(periods=WEEKS_AHEAD, freq='W')
    future["cap"] = 0.0
    forecast = m.predict(future)
    just_forecast = forecast[-WEEKS_AHEAD:][["ds", "yhat"]]
    just_forecast[["yhat"]] = just_forecast[["yhat"]].clip(lower=0).astype('int')
    repo_forecast_points = [{"x": index, "y": row["yhat"]} for (index, row) in just_forecast.iterrows()]

    return {"data": repo_forecast_points }
