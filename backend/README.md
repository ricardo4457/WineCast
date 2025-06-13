# WineCast — Backend

Este é o backend do projeto **WineCast**, uma API inteligente para apoio à decisão na gestão de vinhas, focada em fornecer dados meteorológicos, análise de risco e recomendações para viticultores portugueses.

---

## Funcionalidades

- **API RESTful** para consulta de dados meteorológicos atuais e previsão.
- **Análise inteligente** de risco de fungos, necessidade de rega e sugestão de colheita.
- **WebSocket** para envio de atualizações em tempo real ao frontend.
- **Integração com OpenWeatherMap** para obtenção de dados fiáveis.
- **Testes unitários** para garantir a robustez das principais funções.

---

## Tecnologias Utilizadas

- **Python 3.x**
- **Flask** (API REST)
- **Flask-SocketIO** (WebSocket)
- **Flask-CORS** (CORS)
- **python-dotenv** (variáveis de ambiente)
- **Requests** (HTTP requests)
- **OpenWeatherMap API**

---

## Estrutura do Projeto

```
backend/
│
├── src/
│   ├── app.py                # Inicialização da app Flask e SocketIO
│   ├── routes.py             # Definição dos endpoints da API
│   └── services/
│       └── weather_service.py # Lógica de negócio e integração com a API externa
│
└── tests/
    └── test_weather_service.py # Testes unitários
```

---

## Instalação e Execução

### Pré-requisitos

- Python 3.x
- pip
- Chave da API do OpenWeatherMap

### Passos

1. **Aceda à pasta do backend:**
    ```bash
    cd backend
    ```

2. **Crie e ative um ambiente virtual:**
    ```bash
    python -m venv venv
    .\venv\Scripts\activate
    ```

3. **Instale as dependências:**
    ```bash
    pip install Flask Flask-SocketIO Flask-CORS python-dotenv requests
    ```

4. **Configure a chave da API:**
    - Crie um ficheiro `.env` na raiz do backend com o seguinte conteúdo:
      ```
      OPENWEATHER_API_KEY=chave_aqui
      SECRET_KEY=chave_aqui
      ```

5. **Inicie o servidor:**
    ```bash
    python src/app.py
    ```
    O backend ficará disponível em `http://localhost:5000`.

---

## Endpoints Principais

- `GET /api/weather?lat=...&lon=...`  
  Consulta o estado do tempo atual para as coordenadas fornecidas.

- `POST /api/weather/analyze`  
  Analisa condições meteorológicas (JSON: temperature, humidity, precipitation, wind_speed).

- `POST /api/weather/analyze-humidity`  
  Avalia o risco de fungos (JSON: humidity, temperature).

- `POST /api/weather/irrigation-check`  
  Verifica necessidade de rega (JSON: temperature, precipitation).

- `GET /api/weather/forecast?lat=...&lon=...&days=3`  
  Devolve previsão e análise para os próximos dias.

---

## WebSocket

- **Cliente emite:**  
  `subscribe_to_weather` com `{ lat, lon, days }`

- **Servidor emite:**  
  - `current_weather_update`
  - `analysis_update`
  - `irrigation_status_update`
  - `forecast_update`
  - `weather_error`

---

## Testes

Para executar os testes unitários:
```bash
python -m unittest tests/test_weather_service.py
```

---

## Notas

- O backend está preparado para integração direta com o frontend WineCast.
- Certifique-se de que a chave da API do OpenWeatherMap é válida.
- O CORS está configurado para aceitar pedidos do frontend em `http://localhost:5173`.

---

**Desenvolvido por:**  
Nuno Camacho, Ivo Oliveira, Ricardo Vieira