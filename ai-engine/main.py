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

# --- 1. LOAD SECRETS ---
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ Error: GEMINI_API_KEY not found in .env file")
else:
    genai.configure(api_key=api_key)

# --- 2. MONGODB CONNECTION ---
# ⚠️ ERROR 10061 FIX: Ensure MongoDB is running in a separate terminal!
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.codeguard_db
collection = db.reviews

app = FastAPI(title="CodeGuard AI - Flash", version="2.3")

# --- 3. MODEL SETUP (FIXED: Forces Flash) ---
active_model = None

def get_working_model():
    print("🔍 Configuring AI Model...")
    try:
        # STRICTLY use Gemini 1.5 Flash as requested
        model_name = "gemini-1.5-flash" 
        model = genai.GenerativeModel(model_name)
        print(f"✅ SUCCESS: Connected to {model_name}")
        return model
    except Exception as e:
        print(f"❌ Error setting up {model_name}: {e}")
        return None

active_model = get_working_model()

# --- 4. DATA MODELS ---
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
    timestamp: Optional[str] = None

def fix_mongo_id(document):
    if document:
        document["id"] = str(document["_id"])
        del document["_id"]
    return document

# --- 5. AI LOGIC ---
async def analyze_with_llm_logic(code: str, language: str):
    if not active_model:
        return {
            "qualityScore": 0, 
            "issues": ["AI Model Error"], 
            "recommendations": ["Check API Key"], 
            "securityIssues": 0
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
        "issues": ["Issue 1"],
        "recommendations": ["Fix 1"],
        "correctedCode": "// Fixed code",
        "explanation": "Explanation here"
    }}

    Code:
    ```
    {code}
    ```
    """

    try:
        response = active_model.generate_content(prompt)
        text_response = response.text.strip()
        
        # Cleanup JSON
        if text_response.startswith("```json"):
            text_response = text_response[7:]
        if text_response.endswith("```"):
            text_response = text_response[:-3]
            
        data = json.loads(text_response)
        data["securityIssues"] = len([i for i in data.get("issues", []) if "Security" in i or "Risk" in i])
        return data

    except Exception as e:
        print(f"❌ AI Analysis Error: {e}")
        return {
            "qualityScore": 0,
            "issues": ["Analysis Failed"],
            "recommendations": ["Try again"],
            "securityIssues": 0
        }

# --- 6. ENDPOINTS ---

@app.post("/analyze", response_model=AIResponse)
async def analyze_code_endpoint(request: CodeRequest):
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Code is required")
    
    # 1. Analyze
    result = await analyze_with_llm_logic(request.code, request.language)
    
    # 2. Add Time
    result["timestamp"] = datetime.utcnow().isoformat()
    result["language"] = request.language
    
    # 3. Save to DB
    try:
        await collection.insert_one(result)
        print("💾 Saved to MongoDB successfully")
    except Exception as e:
        print(f"⚠️ DATABASE ERROR: {e}") 
        # We print but don't crash, so the user still sees the result on the main page

    return result

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
            "activeModel": "Gemini 1.5 Flash"
        }
    except Exception as e:
        return {"totalScans": 0, "averageScore": 0, "error": str(e)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)