# ai-engine/main.py
import os
import json
import uvicorn
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

# --- CONFIGURATION ---
# 1. PASTE YOUR API KEY HERE
os.environ["GEMINI_API_KEY"] = "YOUR_API_KEY_HERE" 
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Setup the Model
model = genai.GenerativeModel('gemini-1.5-flash') # Fast & Efficient model

app = FastAPI(title="CodeGuard AI - Advanced", version="2.0")

# --- DATA MODELS ---
class CodeRequest(BaseModel):
    code: str
    language: str = "javascript"

class AIResponse(BaseModel):
    qualityScore: int
    issues: List[str]
    recommendations: List[str]
    correctedCode: Optional[str] = None
    explanation: Optional[str] = None
    securityIssues: int = 0

# --- THE AI PROMPT ---
def analyze_with_llm(code: str, language: str):
    # This prompt tells the AI exactly how to behave
    prompt = f"""
    Act as a Senior Software Engineer and Security Expert. 
    Review the following {language} code.
    
    Your goal is to teach the user how to write better code.
    
    1. Identify critical security risks (XSS, Injection, etc.).
    2. Identify code quality issues (variables, complexity).
    3. PROVIDE A CORRECTED VERSION of the code that fixes these issues.
    4. EXPLAIN WHY the old code was bad and why your fix is better.
    5. Rate the original code from 0 to 100.

    Return the response in strictly valid JSON format like this:
    {{
        "qualityScore": 85,
        "issues": ["List of short error names"],
        "recommendations": ["List of specific advice"],
        "correctedCode": "The full fixed code block here",
        "explanation": "A short paragraph explaining the improvements and teaching the user."
    }}

    Here is the Code to Review:
    ```
    {code}
    ```
    """

    try:
        response = model.generate_content(prompt)
        # Clean up response to ensure it's pure JSON
        cleaned_text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(cleaned_text)
        
        # Add a safety count for security issues
        data["securityIssues"] = len([i for i in data.get("issues", []) if "Security" in i or "Risk" in i or "Critical" in i])
        
        return data
    except Exception as e:
        print(f"AI Error: {e}")
        # Fallback if AI fails
        return {
            "qualityScore": 0,
            "issues": ["AI Analysis Failed"],
            "recommendations": ["Please try again."],
            "correctedCode": "",
            "explanation": "Could not connect to AI Engine.",
            "securityIssues": 0
        }

# --- ROUTES ---
@app.post("/analyze", response_model=AIResponse)
async def analyze_code_endpoint(request: CodeRequest):
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Code is required")
    
    # Call the smart AI
    return analyze_with_llm(request.code, request.language)

@app.get("/")
def health():
    return {"status": "AI Smart Engine Running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)