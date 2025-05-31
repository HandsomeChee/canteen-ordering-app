from flask_socketio import SocketIO

_socketio = None

def init_socket(app):
    global _socketio
    _socketio = SocketIO(app, cors_allowed_origins='*')
    return _socketio

def get_socketio():
    if _socketio is None:
        raise RuntimeError("SocketIO not initialized")
    return _socketio