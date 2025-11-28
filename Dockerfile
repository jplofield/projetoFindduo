# Etapa de build
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa de produção: usando NGINX para servir o React
FROM nginx:alpine

# Copia o build do React para o diretório padrão do NGINX
COPY --from=build /app/build /usr/share/nginx/html

# Remove o arquivo de configuração default do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Adiciona nosso próprio config do nginx
COPY nginx.conf /etc/nginx/conf.d

# Expõe a porta 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
