import json
import google.generativeai as genai

MODEL_NAME = "models/gemini-2.5-flash" 


def classify_nodes(nodes):

    instruction = (
        "You are given a list of items extracted from a conversation. "
        "Ignore answer-type messages. Classify only the question-like items.\n\n"
        "Label each item as:\n"
        "  - 1 → a new, distinct question idea\n"
        "  - 0 → a repeated, rephrased, or closely related question in the same cluster\n\n"
        "Return ONLY a valid JSON array with no explanation, no comments, no text before or after.\n"
        "Format: [{\"id\": \"x\", \"m\": 1}]\n"
        "Classify every item in the list.\n"
    )

    items_json = json.dumps(nodes, ensure_ascii=False)
    (print, items_json)
    prompt = f"{instruction}\nItems:\n{items_json}"

    # --- Call Gemini (minimal overhead) ---
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)
    except Exception:
        return [{"id": n["id"], "m": 1} for n in nodes]

    # --- Extract text quickly ---
    raw = None
    try:
        raw = response.text
    except:
        pass

    if not raw:
        try:
            raw = response.candidates[0].content.parts[0].text
        except:
            raw = ""

    # --- Remove ```json fences if present ---
    cleaned = raw.replace("```json", "").replace("```", "").strip()

    # --- Trim non-JSON prefix/suffix ---
    start = cleaned.find("[")
    if start > 0:
        cleaned = cleaned[start:]

    end = cleaned.rfind("]")
    if end != -1:
        cleaned = cleaned[:end + 1]

    # --- Parse JSON ---
    try:
        return json.loads(cleaned)

    except Exception:
        return [{"id": n["id"], "m": 1} for n in nodes]