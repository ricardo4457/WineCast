from flask import Flask
from app.config import Config
from app.models import db
from app.routes import api


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Inicialize DB
    db.init_app(app)

    # Routes
    app.register_blueprint(api, url_prefix='/api')

    # Create all Tables
    with app.app_context():
        db.create_all()

    return app
