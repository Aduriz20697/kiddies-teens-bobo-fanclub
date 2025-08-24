from flask import Flask, request, jsonify, render_template_string
import sqlite3
from database import create_database, add_member, get_all_members

app = Flask(__name__)

# Initialize database
create_database()

@app.route('/')
def index():
    return render_template_string(open('index.html').read())

@app.route('/join', methods=['POST'])
def join_club():
    """Handle form submission"""
    try:
        data = request.get_json() if request.is_json else request.form
        
        name = data.get('name')
        email = data.get('email')
        school_name = data.get('school_name')
        grade_level = data.get('grade_level')
        class_form = data.get('class_form')
        parent_phone = data.get('parent_phone')
        
        # Validate required fields
        if not all([name, email, school_name, grade_level]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Add member to database
        member_id = add_member(name, email, school_name, grade_level, class_form, parent_phone)
        
        if member_id:
            return jsonify({
                'success': True,
                'message': 'Welcome to the Bobo Fan Club!',
                'member_id': member_id
            })
        else:
            return jsonify({'error': 'Email already registered'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/members')
def view_members():
    """View all registered members"""
    members = get_all_members()
    return jsonify([{
        'id': m[0],
        'name': m[1],
        'email': m[2],
        'school': m[3],
        'grade': m[4],
        'class': m[5],
        'phone': m[6],
        'joined': m[7]
    } for m in members])

if __name__ == '__main__':
    app.run(debug=True)