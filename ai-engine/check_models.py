import os
import google.generativeai as genai

# Paste your API Key here
os.environ["GEMINI_API_KEY"] = "AIzaSyBdn2BHDN2zxNEiE1xzGQpaN03Ok0dlXEk"
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

print("🔍 Searching for available models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ FOUND: {m.name}")
except Exception as e:
    print(f"❌ Error: {e}")