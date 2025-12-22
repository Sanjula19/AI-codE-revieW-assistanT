import os
import json
import uvicorn
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ Error: GEMINI_API_KEY not found in .env file")
else:
    genai.configure(api_key=api_key)

# --- MONGODB CONNECTION ---
# Added missing connection setup so the DB parts work
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.codeguard_db
collection = db.reviews

app = FastAPI(title="CodeGuard AI - Advanced", version="2.1")

# Global variable to store the working model
active_model = None

# --- AUTOMATIC MODEL FINDER ---
def get_working_model():
    """Finds the first available model that supports content generation."""
    print("🔍 Searching for available AI models...")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"✅ Found Model: {m.name}")
                # Prefer flash or pro if available, otherwise take the first one
                if "flash" in m.name or "pro" in m.name:
                    return genai.GenerativeModel(m.name)
        
        # If loop finishes, just try a safe default
        print("⚠️ No specific match found, trying 'gemini-pro'...")
        return genai.GenerativeModel('gemini-pro')
    except Exception as e:
        print(f"❌ Error listing models: {e}")
        return None

# Initialize the model on startup
active_model = get_working_model()

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
    timestamp: Optional[str] = None # Added for type safety

# --- THE AI PROMPT ---
# FIXED: Changed to 'async def' so it can be awaited
async def analyze_with_llm(code: str, language: str):
    if not active_model:
        return {
            "qualityScore": 0,
            "issues": ["AI Configuration Error"],
            "explanation": "Could not initialize a valid AI model at startup. Check terminal logs.",
            "securityIssues": 0,
            "recommendations": [],
            "correctedCode": ""
        }

    prompt = f"""
    Act as a Senior Software Engineer. Review this {language} code.
    
    1. Identify critical security risks.
    2. Identify code quality issues.
    3. PROVIDE A CORRECTED VERSION.
    4. EXPLAIN WHY the old code was bad.
    5. Rate it 0-100.

    Return STRICT JSON:
    {{
        "qualityScore": 85,
        "issues": ["Short error names"],
        "recommendations": ["Specific advice"],
        "correctedCode": "The fixed code",
        "explanation": "Short teaching explanation."
    }}

    Code:
    ```
    {code}
    ```
    """

    try:
        response = active_model.generate_content(prompt)
        print("🔍 RAW AI RESPONSE:", response.text) # Debug log

        cleaned_text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(cleaned_text)
        
        data["securityIssues"] = len([i for i in data.get("issues", []) if "Security" in i or "Risk" in i or "Critical" in i])
        return data

    except Exception as e:
        print(f"❌ AI Error: {e}")
        return {
            "qualityScore": 0,
            "issues": ["AI Analysis Failed"],
            "recommendations": ["Check Python Terminal for error details."],
            "correctedCode": "",
            "explanation": f"System Error: {str(e)}",
            "securityIssues": 0
        }

@app.post("/analyze", response_model=AIResponse)
async def analyze_code_endpoint(request: CodeRequest):
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Code is required")
    
    # 1. Analyze
    # FIXED: Function name corrected (was analyze_with_llm_logic)
    result = await analyze_with_llm(request.code, request.language)
    
    # 2. Add Time
    result["timestamp"] = datetime.utcnow().isoformat()
    result["language"] = request.language
    
    # 3. Save to DB
    try:
        # Added helper to remove _id before returning, just in case
        await collection.insert_one(result.copy())
        print("💾 Saved to MongoDB successfully")
    except Exception as e:
        print(f"⚠️ DATABASE ERROR: {e}") 
        # We print but don't crash, so the user still sees the result on the main page

    return result

# Helper to fix Mongo ID
def fix_mongo_id(document):
    if document:
        document["id"] = str(document["_id"])
        del document["_id"]
    return document

@app.get("/history")
async def get_history():
    history = []
    try:
        cursor = collection.find().sort("timestamp", -1).limit(50)
        async for doc in cursor:
            history.append(fix_mongo_id(doc))
    except Exception as e:
        print(f"⚠️ History Error: {e}")
    return history

@app.get("/dashboard/stats")
async def get_dashboard_stats():
    try:
        total_scans = await collection.count_documents({})
        pipeline = [{"$group": {"_id": None, "avg": {"$avg": "$qualityScore"}}}]
        cursor = collection.aggregate(pipeline)
        result = await cursor.to_list(length=1)
        avg_score = int(result[0]["avg"]) if result else 0
        
        return {
            "totalScans": total_scans,
            "averageScore": avg_score,
            "activeModel": "Gemini Flash"
        }
    except Exception as e:
        return {"totalScans": 0, "averageScore": 0, "error": str(e)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)