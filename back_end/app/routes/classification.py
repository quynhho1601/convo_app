# app/routes/classification.py

from flask import Blueprint, request, jsonify
from app.services.classification_service import classify_nodes

classification_bp = Blueprint("classification", __name__)


@classification_bp.route("/classify-nodes", methods=["POST"])
def classify_nodes_route():
    """
    Receives: { "nodes": [ { "id": "...", "content": "..." }, ... ] }
    Returns:  [ { "id": "...", "m": 1 }, { "id": "...", "m": 0 } ]
    """

    data = request.get_json(silent=True)

    # Validate request body
    if not data or "nodes" not in data:
        return jsonify({"error": "Missing 'nodes' in request body"}), 400

    nodes = data["nodes"]

    # Ensure nodes is a list
    if not isinstance(nodes, list):
        return jsonify({"error": "'nodes' must be a list"}), 400

    # Call Gemini classification service
    results = classify_nodes(nodes)

    # Return to front-end
    return jsonify(results), 200
