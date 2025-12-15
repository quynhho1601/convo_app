from dotenv import load_dotenv
import os

# Force explicit .env path
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

from app import create_app
# Step 1: Create the Flask application
app = create_app()

# Step 2: Run the Flask server
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
