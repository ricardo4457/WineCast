# WineCast - Frontend

Este é o frontend do projeto WineCast, uma aplicação web interativa desenvolvida com React. Foi concebida para apresentar dados meteorológicos e análises agrícolas de forma clara e acessível, consumindo a API e os WebSockets fornecidos pelo backend WineCast.

## Funcionalidades Principais

-   **Dashboard Meteorológico por Região**: Após selecionar uma região vinícola, o utilizador tem acesso a um painel com:
    -   **Condições Atuais**: Temperatura, humidade, vento e precipitação, atualizados em tempo real.
    -   **Análise de Risco de Fungos**: Avaliação da probabilidade de desenvolvimento de fungos.
    -   **Necessidade de Rega**: Indicação sobre se a rega é recomendada.
    -   **Sugestão de Colheita**: Previsão e análise para os próximos dias, auxiliando na decisão da melhor altura para a colheita.
-   **Exploração de Regiões Vinícolas**:
    -   Visualização e seleção de diferentes regiões vinícolas portuguesas (Douro, Minho, Alentejo).
    -   Cada região apresenta uma descrição e um carrossel de imagens representativas.
-   **Recursos Inteligentes Detalhados**:
    -   Acesso a explicações pormenorizadas sobre cada uma das análises (risco de fungos, necessidade de rega, sugestão de colheita), incluindo o seu propósito, os parâmetros considerados e a sua importância para a viticultura.
-   **Navegação Intuitiva**: Interface de utilizador com uma barra de navegação para fácil acesso à página inicial e à página de contactos.
-   **Atualizações em Tempo Real**: Os dados meteorológicos e as análises nas páginas de região são atualizados automaticamente através de uma ligação WebSocket com o backend, indicando o estado "Live" e a hora da última atualização.
-   **Página de Contactos**: Informações sobre os desenvolvedores e um formulário para contacto.

## Tecnologias Utilizadas

-   **React (v18+)**: Biblioteca JavaScript para a construção da interface de utilizador.
-   **Redux Toolkit**: Para uma gestão de estado global eficiente e organizada.
-   **React Router (v6)**: Para a gestão da navegação e das rotas da aplicação.
-   **TailwindCSS**: Framework CSS utilitária para a estilização dos componentes, permitindo um desenvolvimento rápido e responsivo.
-   **Vite**: Ferramenta de frontend para um ambiente de desenvolvimento rápido e otimização do build.
-   **Axios**: Cliente HTTP para realizar pedidos à API REST do backend.
-   **Socket.IO Client**: Para estabelecer e gerir a comunicação WebSocket com o backend.
-   **ESLint**: Para análise estática de código, garantindo a qualidade e consistência do mesmo.

## Estrutura do Projeto (Principais Diretórios e Ficheiros)

```
frontend-winecast/
│
├── public/                 # Recursos estáticos (ex: logo.svg, assets/ para imagens das regiões)
│
├── src/
│   ├── App.jsx             # Componente principal que configura o Router e a estrutura base da UI.
│   ├── AppRoutes.jsx       # Define todas as rotas da aplicação.
│   ├── main.jsx            # Ponto de entrada da aplicação: renderiza o App e configura o Redux Store.
│   ├── index.css           # Importa a base do TailwindCSS.
│   │
│   ├── components/         # Componentes reutilizáveis da UI:
│   │   ├── banners/        # (ImageBanner.jsx, RegionBanner.jsx) - Carrosséis de imagens.
│   │   ├── explanation/    # (FunctionButton.jsx, FunctionButtonList.jsx) - Botões e detalhe das funcionalidades.
│   │   ├── functionalities/ # (ForecastCard.jsx, FungiCard.jsx, IrrigationStatusCard.jsx) - Cards de análise.
│   │   ├── region/         # (RegionButton.jsx, RegionButtonList.jsx) - Botões de seleção de região.
│   │   ├── weather/        # (WeatherCard.jsx) - Card de tempo atual.
│   │   ├── Navigation.jsx      # Barra de navegação.
│   │   ├── LiveStatusFooter.jsx # Rodapé com estado da ligação WebSocket.
│   │   └── LoadingSpinner.jsx # Indicador visual de carregamento.
│   │
│   ├── hooks/              # Hooks customizados:
│   │   └── useWeatherAutoUpdate.js # Lógica para subscrição e gestão de atualizações via WebSocket.
│   │
│   ├── pages/              # Componentes que representam as páginas da aplicação:
│   │   ├── HomePage.jsx    # Página inicial com seleção de regiões e funcionalidades.
│   │   ├── RegionPage.jsx  # Página de detalhe de uma região, com o dashboard meteorológico.
│   │   └── ContactPage.jsx # Página de informações de contacto.
│   │
│   └── stores/             # Configuração e lógica do Redux (slices e thunks):
│       ├── weatherStore.js     # Gestão do estado dos dados meteorológicos, análises e WebSocket.
│       ├── regionStore.js      # Gestão do estado das regiões vinícolas e da região selecionada.
│       └── explanationsStore.js # Gestão do estado das explicações das funcionalidades.
│
├── .eslintrc.cjs           # Configuração do ESLint.
├── index.html              # Ficheiro HTML raiz da aplicação.
├── package.json            # Dependências e scripts do projeto.
├── tailwind.config.js      # Configuração específica do TailwindCSS.
└── vite.config.js          # Configuração do Vite.
```

## Component Breakdown

A seguir, uma descrição dos principais componentes reutilizáveis encontrados em `src/components/`:

-   **`banners/`**
    -   `ImageBanner.jsx`: Apresenta um carrossel de imagens genérico, utilizado, por exemplo, na `HomePage` para exibir imagens relacionadas às funcionalidades.
    -   `RegionBanner.jsx`: Exibe um carrossel de imagens específico para uma região vinícola selecionada, mostrando também o nome e a descrição da região. Utilizado na `RegionPage`.
-   **`explanation/`**
    -   `FunctionButton.jsx`: Renderiza um botão individual para cada "recurso inteligente" (funcionalidade). Ao ser clicado, pode expandir para mostrar detalhes sobre essa funcionalidade.
    -   `FunctionButtonList.jsx`: Agrupa e exibe uma lista de componentes `FunctionButton`, permitindo ao utilizador explorar e obter informações sobre as diversas análises disponíveis.
-   **`functionalities/`**
    -   `ForecastCard.jsx`: Apresenta a previsão meteorológica para os próximos dias, incluindo temperaturas, humidade, vento, precipitação e uma sugestão de colheita.
    -   `FungiCard.jsx`: Mostra a análise do risco de desenvolvimento de fungos com base nas condições meteorológicas atuais.
    -   `IrrigationStatusCard.jsx`: Indica se a irrigação é necessária com base na temperatura e precipitação.
-   **`region/`**
    -   `RegionButton.jsx`: Componente de botão para cada região vinícola. Ao ser clicado, define a região selecionada no estado global e navega para a página da respetiva região.
    -   `RegionButtonList.jsx`: Apresenta uma lista de `RegionButton` para que o utilizador possa selecionar uma região vinícola.
-   **`weather/`**
    -   `WeatherCard.jsx`: Exibe as condições meteorológicas atuais, como temperatura, humidade, velocidade do vento e precipitação.
-   **`Navigation.jsx`**: A barra de navegação principal da aplicação, localizada no topo da página. Permite a navegação para a página inicial (`/`) e para a página de contactos (`/contact`). Inclui um design responsivo para dispositivos móveis.
-   **`LiveStatusFooter.jsx`**: Um pequeno rodapé fixo que indica o estado "Live" da ligação WebSocket e mostra há quanto tempo os dados foram atualizados pela última vez.
-   **`LoadingSpinner.jsx`**: Um componente reutilizável que exibe uma animação de carregamento e um texto opcional. É utilizado em várias partes da aplicação para indicar que os dados estão a ser carregados ou processados.

## Gestão de Estado com Redux

A aplicação utiliza Redux Toolkit para gerir o estado de forma centralizada, dividida nos seguintes *slices*:

-   **`weatherStore.js`**:
    -   Armazena os dados meteorológicos atuais (`currentWeather`), a previsão (`forecast`), as análises (`analysis`, `irrigationStatus`).
    -   Gere o estado da ligação WebSocket e os erros associados.
    -   Contém *thunks* assíncronos para buscar dados iniciais via API REST (`fetchWeather`, `getForecast`, etc.).
    -   Define *reducers* para atualizar o estado com base nos dados recebidos via WebSocket (`setCurrentWeatherFromSocket`, `setAnalysisFromSocket`, etc.).
    -   Inclui ações para subscrever (`subscribeToWeatherUpdates`) e cancelar a subscrição (`unsubscribeFromWeatherUpdates`) dos eventos WebSocket.
-   **`regionStore.js`**:
    -   Mantém a lista de todas as regiões vinícolas disponíveis (`regions`), incluindo os seus nomes, descrições, coordenadas e imagens.
    -   Armazena a região atualmente selecionada pelo utilizador (`selectedRegion`).
-   **`explanationsStore.js`**:
    -   Contém a lista de todas as funcionalidades inteligentes (`functionExplanations`) com os seus títulos, descrições e detalhes (propósito, parâmetros, importância, uso).
    -   Gere a funcionalidade atualmente selecionada para visualização dos detalhes (`selectedFunction`).

## Error Handling and Validations in `weatherStore.js`

O `weatherStore.js` implementa várias camadas de validação e tratamento de erros para garantir a robustez da aplicação:

1.  **Validação de Parâmetros de Entrada (`validateNumberParams`)**:
    -   **Onde**: Esta função é chamada dentro do thunk `fetchWeather`.
    -   **O que faz**: Antes de fazer uma chamada à API para buscar dados meteorológicos, esta função verifica se os parâmetros `lat` (latitude) e `lon` (longitude) são números válidos. Ela converte os valores para `Number` e verifica se o resultado é `NaN` (Not a Number) ou se os valores originais eram `null` ou `undefined`.
    -   **Impacto**: Se a validação falhar, uma `Error` é lançada, prevenindo uma chamada à API com dados inválidos e informando o sistema sobre o problema.

2.  **Tratamento de Erros em Chamadas API (Async Thunks)**:
    -   **Onde**: Todos os thunks assíncronos que realizam chamadas à API (`fetchWeather`, `analyzeWeather`, `analyzeHumidity`, `checkIrrigation`, `getForecast`) utilizam blocos `try...catch`.
    -   **O que faz**: Se uma chamada `axios` (ex: `axios.get`, `axios.post`) falhar (devido a problemas de rede, erro do servidor como 4xx ou 5xx, etc.), a promessa é rejeitada e o controlo passa para o bloco `catch`.
    -   **Impacto**: O erro capturado é então re-lançado (geralmente como `new Error(error.message)`). O Redux Toolkit `createAsyncThunk` lida automaticamente com estas promessas rejeitadas, despachando a ação `.rejected` correspondente. O reducer para esta ação então atualiza o estado, tipicamente definindo `state.status = "failed"` e `state.error = action.error.message`.

3.  **Tratamento de Erros WebSocket**:
    -   **`getSocket()`**:
        -   **Onde**: Na função `getSocket`, ao inicializar a ligação Socket.IO.
        -   **O que faz**: `socket.on("weather_error", (error) => { ... });` regista um listener para um evento personalizado `weather_error` emitido pelo servidor WebSocket.
        -   **Impacto**: Se o servidor emitir este evento, o erro é logado na consola do cliente.
    -   **`subscribeToWeatherUpdates`**:
        -   **Onde**: Dentro da função thunk `subscribeToWeatherUpdates`.
        -   **O que faz**: `socketClient.on('weather_error', (error) => { ... });` regista um listener específico para o evento `weather_error` durante uma subscrição ativa.
        -   **Impacto**: Ao receber um erro do WebSocket, ele despacha a ação `setSocketError` com a mensagem de erro. O reducer `setSocketError` atualiza `state.socketError` e define `state.status = "failed"`.

4.  **Gestão do Estado de Erro no Slice Redux**:
    -   **`extraReducers`**: Para cada thunk assíncrono, o caso `.addCase(action.rejected, ...)` atualiza `state.status` para `"failed"` e armazena a mensagem de erro em `state.error`.
    -   **`setSocketError` Reducer**: Atualiza `state.socketError` com a mensagem de erro do WebSocket e define `state.status` para `"failed"`.
    -   **`clearError` Reducer**: Permite que a UI ou outras lógicas limpem os campos `state.error` e `state.socketError`, por exemplo, quando o utilizador reconhece o erro ou tenta uma nova ação.

5.  **Seletores de Erro (`selectWeatherError`)**:
    -   **Onde**: Definido como um seletor no final de `weatherStore.js`.
    -   **O que faz**: `export const selectWeatherError = (state) => state.weather.error || state.weather.socketError;`
    -   **Impacto**: Fornece um único ponto de acesso para os componentes da UI verificarem se ocorreu algum erro relacionado com o tempo, seja de uma chamada API ou de uma comunicação WebSocket. Isso simplifica a lógica de exibição de mensagens de erro na interface do utilizador.

Estas validações e mecanismos de tratamento de erros ajudam a criar uma experiência de utilizador mais estável, informando sobre problemas de comunicação ou de dados e permitindo que a aplicação lide com eles de forma controlada.

## Rotas da Aplicação

As rotas são definidas em `src/AppRoutes.jsx` utilizando `react-router-dom`:

-   `/`: Página Inicial (`HomePage.jsx`).
-   `/contact`: Página de Contactos (`ContactPage.jsx`).
-   `/region/douro`: Página da Região do Douro (`RegionPage.jsx` com `regionId=1`).
-   `/region/minho`: Página da Região do Minho (`RegionPage.jsx` com `regionId=2`).
-   `/region/alentejo`: Página da Região do Alentejo (`RegionPage.jsx` com `regionId=3`).

## Hooks Customizados

-   **`useAllWeatherFunctions`** (em `src/hooks/useWeatherAutoUpdate.js`):
    -   Este hook é responsável por gerir o ciclo de vida da subscrição WebSocket para atualizações meteorológicas.
    -   Quando as coordenadas de uma região selecionada estão disponíveis, ele despacha a ação `subscribeToWeatherUpdates` para iniciar a receção de dados.
    -   No desmonte do componente ou quando as coordenadas mudam, despacha `unsubscribeFromWeatherUpdates` para limpar os *listeners* do WebSocket, evitando fugas de memória e subscrições desnecessárias.
    -   Devolve `lastUpdated` para que a UI possa mostrar quando os dados foram atualizados pela última vez.

## Estilização

A estilização da aplicação é realizada com **TailwindCSS**. As classes utilitárias são aplicadas diretamente nos componentes JSX. A configuração base do Tailwind é importada em `src/index.css` e personalizações podem ser feitas em `tailwind.config.js`.

## Instalação e Execução

### Pré-requisitos

-   Node.js (versão 16 ou superior é recomendada)
-   npm (geralmente incluído com o Node.js)

### Passos

1.  **Navegar para a diretoria do frontend:**
    ```bash
    cd frontend-winecast
    ```

2.  **Instalar as dependências do projeto:**
    ```bash
    npm install
    ```

3.  **Executar a aplicação em modo de desenvolvimento:**
    ```bash
    npm run dev
    ```
    A aplicação ficará disponível, por defeito, em `http://localhost:5173`. O servidor de desenvolvimento Vite providencia Hot Module Replacement (HMR) para atualizações instantâneas no browser durante o desenvolvimento.

## Notas Adicionais

-   O frontend espera que o [servidor backend WineCast](../backend/README.md) esteja em execução em `http://localhost:5000` para que a API e os WebSockets funcionem corretamente.
-   As imagens das regiões estão localizadas em `public/assets/` e são referenciadas diretamente nos dados das regiões em `regionStore.js`.