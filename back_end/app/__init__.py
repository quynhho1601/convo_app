#register the route so Flask activates it — otherwise the endpoint doesn’t exist.
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    # Enable CORS for all routes (you can restrict later)
    CORS(app)

    # Import and register blueprints (routes)
    from app.routes.generate_prompt import generate_prompt_bp
    from app.routes.classification import classification_bp

    app.register_blueprint(generate_prompt_bp)
    app.register_blueprint(classification_bp)   

    return app
