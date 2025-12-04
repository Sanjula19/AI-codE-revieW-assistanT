# ai-engine/api/app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sys
sys.path.append("..")

from services.analyzer import analyze_code

app = FastAPI(
    title="CodeGuard AI Engine",
    description="Real-time code quality, security & best practices analysis",
    version="1.0.0"
)

class CodeRequest(BaseModel):
    code: str
    language: str = "javascript"

@app.post("/analyze")
async def analyze(req: CodeRequest):
    if not req.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")
    
    result = analyze_code(req.code, req.language)
    return result

@app.get("/")
def health():
    return {"status": "healthy", "engine": "CodeGuard AI v1"}