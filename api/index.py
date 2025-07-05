from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, expose_headers=['Content-Disposition'])

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({'message': 'Hello, World!'})


if __name__ == '__main__':
    app.run(debug=True)