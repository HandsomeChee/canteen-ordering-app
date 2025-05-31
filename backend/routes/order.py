# backend/routes/order.py

from flask import Blueprint, request, jsonify, g
from socket_manager import get_socketio

order_bp = Blueprint('order', __name__, url_prefix='/api/orders')

# Get all orders
@order_bp.route('/', methods=['GET'], strict_slashes=False)
def get_orders():
    rows = g.db.execute(
        'SELECT id, studentId, status FROM orders'
    ).fetchall()
    return jsonify([dict(r) for r in rows])

# Create a new order and emit to everyone and the student room
@order_bp.route('/', methods=['POST'], strict_slashes=False)
def create_order():
    data = request.get_json() or {}
    sid = data.get('studentId')
    status = data.get('status', 'preparing')
    if not sid:
        return jsonify({'error': 'studentId required'}), 400

    cur = g.db.execute(
        "INSERT INTO orders (studentId, status) VALUES (?, ?)",
        (sid, status)
    )
    g.db.commit()
    order_id = cur.lastrowid

    order = {
        'id': order_id,
        'studentId': sid,
        'status': status
    }

    sio = get_socketio()
    # Broadcast to all connected clients (e.g., Admin)
    sio.emit('orderCreated', {'order': order})
    # Also notify the specific student room
    room = f'student_{sid}'
    sio.emit('orderCreated', {'order': order}, room=room)

    return jsonify(order), 201

# Update order status and emit notification
@order_bp.route('/<int:order_id>', methods=['PUT'], strict_slashes=False)
def update_order(order_id):
    data = request.get_json() or {}
    status = data.get('status')
    if not status:
        return jsonify({'error': 'Status required'}), 400

    row = g.db.execute(
        'SELECT studentId FROM orders WHERE id=?',
        (order_id,)
    ).fetchone()
    if not row:
        return jsonify({'error': 'Order not found'}), 404

    sid = row['studentId']
    g.db.execute(
        'UPDATE orders SET status=? WHERE id=?',
        (status, order_id)
    )
    g.db.commit()

    sio = get_socketio()
    room = f'student_{sid}'
    sio.emit(
        'notification',
        {
            'notification': {
                'orderId': order_id,
                'status': status
            }
        },
        room=room
    )

    return ('', 200)

# Delete order
@order_bp.route('/<int:order_id>', methods=['DELETE'], strict_slashes=False)
def delete_order(order_id):
    g.db.execute('DELETE FROM orders WHERE id=?', (order_id,))
    g.db.commit()
    return ('', 204)
