from flask import Flask
from flask_sqlalchemy import  SQLAlchemy
from datetime import  datetime
app = Flask(__name__)
# Antes criar db com o script 'CREATE DATABASE WineCast_db;'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:admin123@localhost'
# Secret Key

# Initialize DB
db = SQLAlchemy(app)
def home():
    return '<h1>WineCast'

if __name__ == '__main__' :
    app.run(debug=True) # fazer isto apenas na fase de development em production debug=False