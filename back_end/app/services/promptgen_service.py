from typing import List
import os
import google.generativeai as genai

#################################
# Gemini Setup
#################################

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
MODEL_NAME = "gemini-2.5-flash-lite"

INSTRUCTION_WRAPPER = """Rewrite the user's instructions into one concise, optimized prompt sentence not question.
Do not answer the questions, explain, or add greetings. Output only the final prompt. User text:
"""

#################################
# Build prompt
#################################

def build_optimization_prompt(questions: List[str]) -> str:
    if not questions:
        return ""
    joined = "\n".join(q.strip() for q in questions if q.strip())
    return INSTRUCTION_WRAPPER + joined


#################################
# Non-streaming generation (fallback)
#################################

def generate_response(prompt: str, max_new_tokens: int = 200) -> str:
    if not prompt.strip():
        return ""

    model = genai.GenerativeModel(MODEL_NAME)
    response = model.generate_content(prompt)

    text = response.text.strip()
    print(text)
    # Remove common prefixes
    for prefix in [
        "Here is the final prompt:",
        "Here is your final prompt:",
        "Final prompt:",
        "Optimized prompt:",
    ]:
        if text.lower().startswith(prefix.lower()):
            text = text[len(prefix):].strip()

    return text or "No optimized prompt returned from backend."


#################################
# Gemini Streaming
#################################

def stream_optimized_prompt(questions: List[str], max_new_tokens: int = 200):
    """
    Streams optimized prompt tokens from Gemini (server-side streaming).
    """
    full_prompt = build_optimization_prompt(questions)
    if not full_prompt.strip():
        yield ""
        return

    model = genai.GenerativeModel(MODEL_NAME)

    # Streaming call
    response = model.generate_content(
        full_prompt,
        stream=True,
        generation_config={
            "temperature": 0.3,
            "top_p": 0.9,
            "max_output_tokens": max_new_tokens
        }
    )

    for chunk in response:
        if chunk.text:
            yield chunk.text
