class WebSocketHandler:
    def __init__(self, app):
        self.app = app
        self.clients = set()

    def register(self, websocket):
        self.clients.add(websocket)

    def unregister(self, websocket):
        self.clients.remove(websocket)

    async def send_message(self, message):
        for client in self.clients:
            await client.send(message)

    async def handle_connection(self, websocket, path):
        self.register(websocket)
        try:
            async for message in websocket:
                await self.send_message(f"Received: {message}")
        finally:
            self.unregister(websocket)