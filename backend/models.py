from flask_sqlalchemy import SQLAlchemy

# Setup SQLAlchemy (import db into your app.py)
db = SQLAlchemy()

class Menu(db.Model):
    __tablename__ = 'menu'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    image = db.Column(db.String)

    def to_dict(self):
        # Convert Menu object into a simple dictionary
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'description': self.description,
            'imageKey': self.image
        }

class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    studentId = db.Column(db.String, nullable=False)
    status = db.Column(db.String, nullable=False)

    def to_dict(self):
        # Convert Order object into a simple dictionary
        return {
            'id': self.id,
            'studentId': self.studentId,
            'status': self.status
        }
