from utils.websocket_handler import WebSocketHandler

def test_register_unregister():
    handler = WebSocketHandler(None)
    mock_client = "mock_client"
    handler.register(mock_client)
    assert mock_client in handler.clients
    handler.unregister(mock_client)
    assert mock_client not in handler.clients