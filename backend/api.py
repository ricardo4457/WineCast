from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return '<h1>WineCast'

if __name__ == '__main__' :
    app.run(debug=True) # fazer isto apenas na fase de development em production debug=False