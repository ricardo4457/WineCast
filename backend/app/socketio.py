# app/socketio.py
from flask_socketio import SocketIO, emit
from flask import request

def init_socketio(socketio):
    @socketio.on('connect')
    def handle_connect():
        print('Cliente conectado')
        emit('status', {'status': 'connected'})

    @socketio.on('disconnect')
    def handle_disconnect():
        print('Cliente desconectado')

    @socketio.on('subscribe')
    def handle_subscribe(data):
        city_id = data.get('city_id')
        print(f'Cliente {request.sid} inscrito para cidade {city_id}')
        emit('subscription', {'status': 'subscribed', 'city_id': city_id})