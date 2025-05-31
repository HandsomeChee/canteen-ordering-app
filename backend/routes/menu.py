import os
from flask import Blueprint, request, jsonify, g, current_app
from werkzeug.utils import secure_filename

menu_bp = Blueprint('menu', __name__, url_prefix='/api/menu')

# File upload setup
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename: str) -> bool:
    return (
        '.' in filename and
        filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
    )

# Get all menu items
@menu_bp.route('/', methods=['GET'], strict_slashes=False)
def get_menu():
    db = g.db
    rows = db.execute(
        'SELECT id, category, name, price, description, image AS imageKey FROM menu'
    ).fetchall()
    return jsonify([dict(r) for r in rows])

# Add new menu item
@menu_bp.route('/', methods=['POST'], strict_slashes=False)
def add_menu():
    db = g.db
    name        = request.form.get('name')
    category    = request.form.get('category')
    price       = request.form.get('price')
    description = request.form.get('description')
    file        = request.files.get('image')

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        file.save(save_path)
        image_key = f'/uploads/{filename}'
    else:
        return jsonify({'error': 'Missing or invalid image file'}), 400

    cur = db.execute(
        'INSERT INTO menu (category, name, price, description, image) VALUES (?, ?, ?, ?, ?)',
        (category, name, price, description, image_key)
    )
    db.commit()
    return jsonify({'id': cur.lastrowid})

# Update menu item
@menu_bp.route('/<int:item_id>', methods=['PUT'], strict_slashes=False)
def update_menu(item_id):
    db = g.db
    ct = request.content_type or ''

    if ct.startswith('multipart/form-data'):
        name        = request.form.get('name')
        category    = request.form.get('category')
        price       = request.form.get('price')
        description = request.form.get('description')
        file        = request.files.get('image')

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            save_path = os.path.join(UPLOAD_FOLDER, filename)
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            file.save(save_path)
            image_key = f'/uploads/{filename}'
        else:
            image_key = request.form.get('imageKey')

    else:
        data        = request.get_json() or {}
        name        = data.get('name')
        category    = data.get('category')
        price       = data.get('price')
        description = data.get('description')
        image_key   = data.get('imageKey')

    # Check required fields
    if not all([name, category, price, description, image_key]):
        return jsonify({'error': 'Missing required fields'}), 400

    cur = db.execute(
        'UPDATE menu SET category=?, name=?, price=?, description=?, image=? WHERE id=?',
        (category, name, price, description, image_key, item_id)
    )
    db.commit()
    if cur.rowcount == 0:
        return jsonify({'error': 'Menu item not found'}), 404

    return jsonify({'id': item_id})

# Delete menu item
@menu_bp.route('/<int:item_id>', methods=['DELETE'], strict_slashes=False)
def delete_menu(item_id):
    db = g.db
    db.execute('DELETE FROM menu WHERE id=?', (item_id,))
    db.commit()
    return ('', 204)
