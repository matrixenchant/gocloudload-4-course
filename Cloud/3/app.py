from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/cats', methods=['GET'])
def get_cats():
    return jsonify({'message': 'Welcome to the world of cats!'})

@app.route('/api/cats/facts', methods=['GET'])
def cat_facts():
    return jsonify({'facts': [
        'Cats sleep 12-16 hours a day.',
        'They have excellent night vision.',
        'Cats can make over 100 different sounds.'
    ]})

@app.route('/api/cats/breeds', methods=['GET'])
def cat_breeds():
    return jsonify({'breeds': [
        'Persian',
        'Maine Coon',
        'Siamese',
        'Bengal'
    ]})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)