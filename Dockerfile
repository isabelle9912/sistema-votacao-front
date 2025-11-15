# --- Estágio 1: Build (Onde o Vite faz a mágica) ---
# Usamos a imagem oficial do Node.js 20 (Alpine é uma versão leve)
FROM node:20-alpine AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e package-lock.json primeiro
# Isso aproveita o cache do Docker. Se eles não mudarem,
# o Docker não vai reinstalar tudo de novo.
COPY package*.json ./

# Instala as dependências de desenvolvimento
RUN npm install --production=false

# Copia todo o resto do código-fonte
COPY . .

# Roda o comando de build do Vite
RUN npm run build

# --- Estágio 2: Serve (Onde o Nginx entrega o app) ---
# Usamos a imagem super leve e oficial do Nginx
FROM nginx:alpine

# Remove a página padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos estáticos do Estágio 1 (da pasta /app/dist)
# para a pasta que o Nginx usa para servir arquivos
COPY --from=build /app/dist /usr/share/nginx/html

# EXPOSIÇÃO DE PORTA
# O Nginx no container vai rodar na porta 80 por padrão
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]