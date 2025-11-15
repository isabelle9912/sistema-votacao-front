# Sistema de Votação em Tempo Real (Frontend)

Este é o projeto frontend em React para o minicurso **"Escalabilidade na Prática: Construindo um Sistema de Votação em Tempo Real"**, apresentado na Semana Nacional de Ciência e Tecnologia (SNCT).

Este app simula uma enquete de votação (como a do BBB), demonstrando como construir uma interface reativa que se comunica com um backend de alta performance (Go) e recebe atualizações instantâneas via WebSockets.

## Funcionalidades

- **Votação Interativa:** Interface com cards clicáveis para votar nas opções.
- **Resultados em Tempo Real:** Os resultados da votação são atualizados instantaneamente para todos os usuários conectados, sem a necessidade de recarregar a página, usando uma conexão WebSocket.
- **Comunicação com API:** O frontend consome uma API REST para:
  - `GET /votes`: Buscar os resultados atuais ao carregar a página.
  - `POST /votes`: Enviar um novo voto.
- **Feedback de UI/UX:** Fornece feedback visual para estados de carregamento (ao votar) e tratamento de erros.
- **Design Responsivo:** A interface se adapta a diferentes tamanhos de tela.

## Tecnologias Utilizadas

- **[React](https://reactjs.org/)**: Biblioteca para construção da interface de usuário.
- **[Vite](https://vitejs.dev/)**: Ferramenta de build e servidor de desenvolvimento rápido.
- **[TypeScript](https://www.typescriptlang.org/)**: Superset do JavaScript que adiciona tipagem estática.
- **[Docker](https://www.docker.com/)**: Plataforma de containerização para empacotar e rodar a aplicação em qualquer ambiente.
- **[Nginx](https://www.nginx.com/)**: Servidor web de alta performance usado na imagem Docker para servir os arquivos estáticos.

---

## Como Rodar o Projeto

Você pode rodar este projeto de duas formas: localmente para desenvolvimento ou via Docker.

### 1\. Ambiente de Desenvolvimento (Local)

**Pré-requisitos:**

- [Node.js](https://nodejs.org/) (v18 ou superior)
- `npm` ou `yarn`

**Passos:**

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/isabelle9912/sistema-votacao-front.git
    cd seu-repositorio
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure o Backend (Opcional):**
    Por padrão, o app tentará se conectar à API no mesmo domínio (`/api/v1`). Se o seu backend (Go) estiver rodando em uma porta diferente (ex: `http://localhost:8080`), crie um arquivo `.env` na raiz do projeto:

    ```.env
    VITE_API_URL=http://localhost:8080/api/v1
    ```

4.  **Inicie o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

    O app estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

---

### 2\. Ambiente de Produção (com Docker)

Esta é a forma recomendada para simular um ambiente de produção ou para rodar a aplicação sem precisar instalar o Node.js.

**Pré-requisito:**

- [Docker](https://www.docker.com/get-started)

**Passos:**

1.  **Construa a imagem Docker:**
    (Na raiz do projeto, onde está o `Dockerfile`)

    ```bash
    docker build -t sistema-votacao-front .
    ```

2.  **Rode o container:**

    ```bash
    docker run -p 3000:80 sistema-votacao-front
    ```

    - Isso mapeia a porta `3000` do seu computador para a porta `80` do container (onde o Nginx está rodando).
    - Acesse a aplicação em `http://localhost:3000`.

---

## 📂 Estrutura do Projeto

- `public/`: Contém os assets estáticos (como as imagens dos mascotes).
- `src/`: Contém todo o código-fonte da aplicação.
  - `components/`: Componentes React reutilizáveis (ex: `VotingPoll.tsx`).
  - `helpers/`: Funções utilitárias (ex: `baseUrl.ts` para montar a URL da API).
  - `hooks/`: Custom Hooks React (ex: `useVotingPoll.ts` com toda a lógica da aplicação).
  - `services/`: Camada de comunicação com a API (ex: `api.ts`).
  - `App.tsx`: Componente raiz.
  - `main.tsx`: Ponto de entrada da aplicação.
- `Dockerfile`: Define a receita para construir a imagem Docker (multi-stage build).

## 📡 Endpoints da API (Expectativa)

Este frontend espera que o backend forneça os seguintes endpoints:

- **`GET /api/v1/votes`**:

  - **Ação:** Busca o estado atual da votação.
  - **Resposta (JSON):**
    ```json
    {
      "golang": 100,
      "react": 90,
      "redis": 50,
      "cassandra": 30
    }
    ```

- **`POST /api/v1/votes`**:

  - **Ação:** Registra um novo voto.
  - **Corpo (JSON):**
    ```json
    {
      "optionId": "react"
    }
    ```

- **`WS /api/v1/votes/ws`**:

  - **Ação:** Abre uma conexão WebSocket.
  - **Mensagens (push do servidor):** O servidor envia o JSON completo dos votos (igual ao `GET /votes`) sempre que a contagem é atualizada.
