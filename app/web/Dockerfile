# ---- 1) Build de Vite ----
FROM node:20-alpine AS build
WORKDIR /app

# Las dependencias en una capa aparte: si no cambian, no se reinstalan.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- 2) nginx sirviendo el estático, SIN root ----
# Imagen «unprivileged»: el master de nginx corre como usuario 101, no como root
# (guía docker.md, Tema 2 y perfil ★, obligatorio en lo expuesto a internet).
# Se mantiene el puerto 80 a propósito: el túnel de Cloudflare apunta a
# orbita-web:80 desde el panel, que no se toca desde aquí. Bindear el 80 sin
# root necesita la capacidad NET_BIND_SERVICE, que se concede en el compose.
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY seguridad.conf /etc/nginx/seguridad.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
