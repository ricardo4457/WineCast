from app.models.base import db
from datetime import datetime

class Weather(db.Model):
    __tablename__ = 'weather_data'

    # Structure
    id = db.Column(db.Integer, primary_key=True)
   # falta meter campos
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relations
    products = db.relationship('Product', backref='user', lazy=True)

    def to_dict(self):
        return {
            # falta meter campos
            'id': self.id,
            'created_at': self.created_at.isoformat()
        }

