# FROM node:20.19.0 AS build

# WORKDIR /app
# COPY package.json package-lock.json* ./
# RUN npm install

# COPY . .

# EXPOSE 5173
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Dockerfile para el frontend (React con Vite)
FROM node:20-alpine as build

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Usar nginx para servir la aplicación
FROM nginx:alpine

# Copiar archivos construidos
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]