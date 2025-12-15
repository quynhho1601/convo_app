from typing import Any, Dict, List, Tuple


def validate_generate_prompt_payload(data: Dict[str, Any]) -> Tuple[bool, str, List[str]]:
    """
    Validate JSON payload for /generate-prompt.
    Returns: (is_valid, error_message, selected_contents)
    """
    if not isinstance(data, dict):
        return False, "Request body must be a JSON object.", []

    selected_contents = data.get("selectedContents")

    if selected_contents is None:
        return False, "Missing 'selectedContents' field.", []

    if not isinstance(selected_contents, list):
        return False, "'selectedContents' must be a list.", []

    if not all(isinstance(item, str) for item in selected_contents):
        return False, "All items in 'selectedContents' must be strings.", []

    return True, "", selected_contents
