# WineCast

## Descrição Curta

WineCast é uma aplicação web desenhada para auxiliar viticultores na gestão das suas vinhas, fornecendo dados meteorológicos em tempo real, previsões e análises agronómicas específicas. O objetivo é otimizar a produção de vinho através de recomendações inteligentes baseadas em condições climáticas, focando-se em regiões vinícolas portuguesas.

## Funcionalidades Principais

*   **Dados Meteorológicos Atuais:** Visualização de temperatura, humidade, precipitação e velocidade do vento para regiões selecionadas.
*   **Previsão Meteorológica:** Acesso a previsões para os próximos dias, ajudando no planeamento de atividades agrícolas.
*   **Análise de Risco de Fungos:** Avaliação do risco de desenvolvimento de fungos com base nas condições de humidade e temperatura.
*   **Necessidade de Rega:** Indicação sobre a necessidade de irrigação, considerando a temperatura e a precipitação.
*   **Sugestão de Colheita:** Recomendações sobre o momento ideal para a colheita, baseadas na análise das condições meteorológicas atuais e futuras.

## Tecnologias Utilizadas

**Frontend:**
*   React (com Vite)
*   Redux (com Redux Toolkit) para gestão de estado
*   React Router para navegação
*   Tailwind CSS para estilização
*   Socket.IO Client para comunicação em tempo real
*   Axios para pedidos HTTP

**Backend:**
*   Python
*   Flask (microframework web)
*   Flask-SocketIO para comunicação bidirecional baseada em eventos
*   Flask-CORS para gestão de Cross-Origin Resource Sharing
*   `python-dotenv` para gestão de variáveis de ambiente
*   `requests` para realizar pedidos a APIs externas (ex: OpenWeatherMap)

## Estrutura do Projeto

O projeto está organizado em duas pastas principais:

*   `frontend-winecast/`: Contém toda a aplicação frontend.
    *   `public/`: Ficheiros estáticos e assets (imagens, logo).
    *   `src/`: Código fonte da aplicação React.
        *   `components/`: Componentes reutilizáveis da UI.
        *   `hooks/`: Hooks personalizados (ex: `useWeatherAutoUpdate.js`).
        *   `pages/`: Componentes que representam as diferentes páginas da aplicação.
        *   `stores/`: Configuração e lógica do Redux (reducers, actions, selectors).
        *   `App.jsx`, `main.jsx`: Pontos de entrada e configuração principal da aplicação React.
*   `backend/`: Contém toda a aplicação backend.
    *   `src/`: Código fonte da aplicação Flask.
        *   `services/`: Lógica de negócio, como o `weather_service.py` que interage com APIs meteorológicas e realiza análises.
        *   `app.py`: Ficheiro principal da aplicação Flask, configuração do servidor e do SocketIO.
        *   `routes.py`: Definição dos endpoints da API REST.
    *   `tests/`: Testes unitários para os serviços do backend (ex: `test_weather_service.py`).
    *   (Recomendado) `requirements.txt`: Lista de dependências Python.

## Como Executar

### Pré-requisitos

*   Node.js (versão 16.x ou superior) e npm (ou yarn)
*   Python (versão 3.8 ou superior) e pip
*   Um ficheiro `.env` na raiz da pasta `backend/`. Crie este ficheiro com o seguinte conteúdo, substituindo pelos seus valores:
    ```env
    # filepath: backend/.env
    OPENWEATHER_API_KEY=a_sua_chave_api_do_openweathermap
    SECRET_KEY=uma_chave_secreta_forte_para_flask
    ```

### Configuração e Execução do Backend

1.  Navegue até à pasta `backend/`:
    ```bash
    cd backend
    ```
2.  Crie e ative um ambiente virtual (recomendado):
    ```bash
    python -m venv venv
    # No Windows
    .\venv\Scripts\activate
    # No macOS/Linux
    source venv/bin/activate
    ```
3.  Instale as dependências Python. Se não existir um ficheiro `requirements.txt`, pode instalar as principais dependências individualmente:
    ```bash
    pip install Flask Flask-SocketIO Flask-CORS python-dotenv requests
    # Se tiver um requirements.txt:
    # pip install -r requirements.txt
    ```
4.  Execute a aplicação Flask:
    ```bash
    python src/app.py
    ```
    O backend estará em execução em `http://localhost:5000`.

### Configuração e Execução do Frontend

1.  Navegue até à pasta `frontend-winecast/` (a partir da raiz do projeto):
    ```bash
    cd frontend-winecast
    ```
2.  Instale as dependências do Node.js:
    ```bash
    npm install
    # ou, se utilizar yarn:
    # yarn install
    ```
3.  Execute a aplicação React em modo de desenvolvimento:
    ```bash
    npm run dev
    # ou, se utilizar yarn:
    # yarn dev
    ```
    O frontend estará acessível em `http://localhost:5173` (ou outra porta indicada pelo Vite na consola).

## Scripts Disponíveis (Frontend)

Dentro da pasta `frontend-winecast/`:

*   `npm run dev`: Inicia o servidor de desenvolvimento com hot reload.
*   `npm run preview`: Permite pré-visualizar a build de produção localmente.

## Testes (Backend)

Para executar os testes unitários do backend:

1.  Certifique-se que está na pasta `backend/` e que o ambiente virtual está ativado.
2.  Execute o comando:
    ```bash
    python -m unittest tests/test_weather_service.py
    # Ou para descobrir e executar todos os testes na pasta 'tests':
    # python -m unittest discover tests
    ```

## Autores

Este projeto foi desenvolvido por:
*   Ivo Oliveira (ivo.oliveira.2022267@my.istec.pt)
*   Nuno Camacho (nuno.camacho.2022276@my.istec.pt)
*   Ricardo Vieira (ricardo.vieira.50073@my.istec.pt)