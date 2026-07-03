# frontend/Dockerfile — Build multi-etapa para el frontend React.
#
# Etapas:
#   build - Compila la app con Vite usando Node.js 20 Alpine.
#   nginx - Sirve los archivos estáticos generados usando Nginx Alpine.
#            Configura el fallback a index.html para el enrutamiento SPA.
#
# Puerto expuesto: 80.

FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage con nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Configuración de nginx para SPA
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
