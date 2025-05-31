#backend/app.py

import os
import sqlite3
from flask import Flask, g, send_from_directory
from flask_cors import CORS
from flask_socketio import join_room, emit
from socket_manager import init_socket, get_socketio

# Create Flask app
def create_app():
    app = Flask(__name__)
    CORS(app)

    # Set SQLite DB path
    app.config['DATABASE'] = os.path.join(os.getcwd(), 'database.db')

    # Open DB connection only when needed
    def get_db():
        if 'db' not in g:
            conn = sqlite3.connect(app.config['DATABASE'])
            conn.row_factory = sqlite3.Row
            g.db = conn
        return g.db

    @app.before_request
    def before_request():
        g.db = get_db()

    @app.teardown_appcontext
    def teardown_db(exc):
        db = g.pop('db', None)
        if db is not None:
            db.close()

    # Serve uploaded images
    upload_folder = os.path.join(os.getcwd(), 'uploads')
    os.makedirs(upload_folder, exist_ok=True)

    @app.route('/uploads/<path:filename>')
    def serve_upload(filename):
        return send_from_directory(upload_folder, filename)

    # Register API routes
    from routes.menu import menu_bp
    from routes.order import order_bp
    app.register_blueprint(menu_bp, url_prefix='/api/menu')
    app.register_blueprint(order_bp, url_prefix='/api/orders')

    # Auto-add 'category' column to menu table if it doesn't exist
    with app.app_context():
        db = get_db()
        existing_cols = db.execute("PRAGMA table_info(menu)").fetchall()
        col_names = [col["name"] for col in existing_cols]
        if 'category' not in col_names:
            db.execute("ALTER TABLE menu ADD COLUMN category TEXT")
            db.commit()
            print("Added missing 'category' column to 'menu' table")
        else:
            print("'category' column already exists")

    # Set up Socket.IO
    sio = init_socket(app)

    @sio.on('connect')
    def on_connect():
        print('Client connected')

    @sio.on('joinStudentRoom')
    def on_join(student_id):
        room = f"student_{student_id}"
        join_room(room)
        emit('joinedRoomConfirmation', {'room': room}, room=room)
        print(f"Client joined room: {room}")

    @sio.on('disconnect')
    def on_disconnect():
        print('Client disconnected')

    return app

# Start the server
if __name__ == '__main__':
    app = create_app()
    sio = get_socketio()
    print("Starting server on http://0.0.0.0:3000")
    sio.run(app, host='0.0.0.0', port=3000, debug=True)
