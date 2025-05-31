from flask import Flask
from flask import jsonify
from flask_socketio import SocketIO, emit
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")  

ORDER_NAMESPACE = '/orders'

order_history = []
order_counter = 1

@app.route('/orders', methods=['GET'])
def get_orders_http():
    return jsonify(order_history)

@socketio.on('connect', namespace=ORDER_NAMESPACE)
def handle_connect_orders():
    print('Client connected to /orders')

@socketio.on('disconnect', namespace=ORDER_NAMESPACE)
def handle_disconnect_orders():
    print('Client disconnected from /orders')

@socketio.on('get_orders', namespace=ORDER_NAMESPACE)
def handle_get_orders(data=None):
    """Client asks for their own order history."""
    print('Client requested order history')
    try:
        if data:
            payload = json.loads(data)
            student_id = payload.get('studentId')
            if student_id:
                filtered_orders = [o for o in order_history if o.get('studentId') == student_id]
                emit('orders_list', json.dumps(filtered_orders), namespace=ORDER_NAMESPACE)
                return
        emit('orders_list', json.dumps(order_history), namespace=ORDER_NAMESPACE)
    except Exception as e:
        emit('orders_list', json.dumps({'success': False, 'error': str(e)}), namespace=ORDER_NAMESPACE)

@socketio.on('add_order', namespace=ORDER_NAMESPACE)
def handle_add_order(data: str):
    """Add a new order sent from the client."""
    global order_counter
    print('Received new order:', data)
    try:
        order = json.loads(data)
        order['orderNumber'] = order_counter
        order_counter += 1 
        order_history.append(order)  
        print(f"Order added: {order}")
        emit('order_added', json.dumps({'success': True}), namespace=ORDER_NAMESPACE)  # Emit success
        emit('orders_list', json.dumps(order_history), namespace=ORDER_NAMESPACE)  # Emit updated orders
    except Exception as e:
        emit('order_added', json.dumps({'success': False, 'error': str(e)}), namespace=ORDER_NAMESPACE)

@socketio.on('update_order_status', namespace='/orders')
def handle_update_status(data):
    data = json.loads(data)
    order_number = data.get('orderNumber')
    new_status = data.get('status')

    if order_number is not None and new_status:
        for order in order_history:
            if order.get('orderNumber') == order_number:
                order['status'] = new_status
                print(f"Updated order {order_number} to {new_status}")
                break

        emit('orders_list', json.dumps(order_history), namespace='/orders')


@socketio.on('clear_orders', namespace=ORDER_NAMESPACE)
def handle_clear_orders():
    """Client requests to clear all orders."""
    print('Clearing order history')
    order_history.clear()
    emit('orders_cleared', json.dumps({'success': True}), namespace=ORDER_NAMESPACE)

@socketio.on('delete_order', namespace=ORDER_NAMESPACE)
def handle_delete_order(data):
    print('Received delete order number:', data)
    global order_history
    try:
        payload = json.loads(data)
        order_number = payload.get('orderNumber')

        if order_number is not None:
            order_history = [o for o in order_history if o.get('orderNumber') != order_number]
            print(f"Order {order_number} deleted.")
            emit('orders_list', json.dumps(order_history), namespace=ORDER_NAMESPACE, broadcast=True)
            emit('order_deleted', json.dumps({'success': True}), namespace=ORDER_NAMESPACE)
        else:
            emit('order_deleted', json.dumps({'success': False, 'error': 'Missing order number'}), namespace=ORDER_NAMESPACE)
    except Exception as e:
        emit('order_deleted', json.dumps({'success': False, 'error': str(e)}), namespace=ORDER_NAMESPACE)


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5001, debug=True)



