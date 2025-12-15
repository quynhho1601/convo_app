// Backend base URL (change later for production)
export const BACKEND_URL = "http://127.0.0.1:5000";

// Specific endpoint for generating prompts
export const GENERATE_PROMPT_ENDPOINT = `${BACKEND_URL}/generate-prompt`;
export const CLASSIFY_NODES_ENDPOINT = `${BACKEND_URL}/classify-nodes`;
