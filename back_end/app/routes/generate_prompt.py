from flask import Blueprint, request, Response, stream_with_context, jsonify
from app.services.promptgen_service import stream_optimized_prompt
from app.utils.validator import validate_generate_prompt_payload

generate_prompt_bp = Blueprint("generate_prompt", __name__)

@generate_prompt_bp.route("/generate-prompt", methods=["POST"])
def generate_prompt():
    data = request.get_json(silent=True) or {}

    is_valid, error_message, selected_contents = validate_generate_prompt_payload(data)
    if not is_valid:
        return jsonify({"error": error_message}), 400

    def generate():
        # Stream Gemini output token-by-token
        for chunk in stream_optimized_prompt(selected_contents):
            yield chunk

    return Response(
        stream_with_context(generate()),
        mimetype="text/plain"
    )
