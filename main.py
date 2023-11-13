from flask import Flask, render_template, abort
from werkzeug.exceptions import HTTPException

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.errorhandler(HTTPException)
def errorhandler(error: HTTPException):
    if isinstance(error, HTTPException):
        response = {
            "name": error.name,
            "description": error.description,
            "code": error.code
        }
        return render_template("errorHandler.html", response=response), error.code
    else:
        return "Internal server error", 500


@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run('', 16, debug=True)