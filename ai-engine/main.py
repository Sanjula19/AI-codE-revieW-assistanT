# ai-engine/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import uvicorn

app = FastAPI(
    title="CodeGuard AI Engine",
    description="Real-time code quality & security analysis",
    version="1.0"
)

class CodeRequest(BaseModel):
    code: str
    language: str = "javascript"  # optional

class AIResponse(BaseModel):
    qualityScore: int
    issues: List[str]
    recommendations: List[str]
    securityIssues: int = 0
    bestPractices: bool = False

def analyze_code(code: str, language: str):
    lines = len(code.splitlines())
    score = 100
    issues = []
    recommendations = []

    # Real heuristic rules (this is smart dummy AI)
    if "eval(" in code:
        issues.append("CRITICAL: eval() detected — Remote Code Execution Risk")
        recommendations.append("Never use eval(). Use JSON.parse or safe alternatives.")
        score -= 50
    if "alert(" in code or "document.write(" in code:
        issues.append("Potential XSS vulnerability")
        recommendations.append("Sanitize all user inputs. Avoid direct DOM writes.")
        score -= 30
    if language == "javascript" and "var " in code:
        issues.append("Outdated 'var' keyword")
        recommendations.append("Use 'let' or 'const' for better scoping")
        score -= 10
    if "console.log" in code:
        issues.append("Debug statement in production code")
        recommendations.append("Remove console.log before deploy")
        score -= 5
    if lines > 100:
        issues.append("File too long (>100 lines)")
        recommendations.append("Split into smaller, focused modules")
        score -= 15
    if "password" in code.lower() and "=" in code:
        issues.append("Hardcoded credential detected")
        recommendations.append("Use environment variables or secret manager")
        score -= 40

    if not issues:
        issues = ["No issues found!"]
        recommendations = ["Excellent code! Keep it up."]

    return {
        "qualityScore": max(10, score),
        "issues": issues,
        "recommendations": recommendations,
        "securityIssues": sum(1 for i in issues if "CRITICAL" in i or "XSS" in i or "password" in i.lower()),
        "bestPractices": score >= 85
    }

@app.post("/analyze", response_model=AIResponse)
async def analyze_code_endpoint(request: CodeRequest):
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Code is required")
    
    result = analyze_code(request.code, request.language)
    return result

@app.get("/")
def health():
    return {"status": "AI Engine Running", "ready": True}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)