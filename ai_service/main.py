from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Literal

app = FastAPI(title="AI Goal Tracker - AI Service")


class GoalPayload(BaseModel):
    title: str
    description: str = ""
    category: str
    priority: str
    deadline: str
    status: str


class EvaluationRequest(BaseModel):
    goal: GoalPayload
    user_explanation: str = Field(..., min_length=10)


class EvaluationResponse(BaseModel):
    completion_level: Literal["fully_completed", "partially_completed", "not_completed"]
    completion_percentage: int
    feedback: str


@app.post("/ai/evaluate-goal", response_model=EvaluationResponse)
async def evaluate_goal(payload: EvaluationRequest):
    explanation = payload.user_explanation.lower()

    if any(keyword in explanation for keyword in ["finished", "completed", "done", "achieved"]):
        completion_level = "fully_completed"
        completion_percentage = 100
        feedback = "Great work! Your explanation shows the goal is fully completed."
    elif any(keyword in explanation for keyword in ["started", "progress", "half", "partial"]):
        completion_level = "partially_completed"
        completion_percentage = 60
        feedback = "Nice progress! It sounds like you're partway there. Keep it up."
    else:
        completion_level = "not_completed"
        completion_percentage = 20
        feedback = "It seems the goal might not be completed yet. Consider adjusting your plan."

    return EvaluationResponse(
        completion_level=completion_level,
        completion_percentage=completion_percentage,
        feedback=feedback,
    )
