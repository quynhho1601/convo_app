from dotenv import load_dotenv
import os
load_dotenv()
print("ENV LOADED KEY =", os.environ.get("GEMINI_API_KEY"))
