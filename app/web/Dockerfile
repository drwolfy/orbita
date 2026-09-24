# ---- 1) Build de Vite ----
# Node 24 (LTS hasta 04/2028): el 20 dejó de tener soporte el 30/04/2026.
# Fijado por digest: el tag es mutable (perfil ★).
FROM node:24-alpine@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1 AS build
WORKDIR /app

# Las dependencias en una capa aparte: si no cambian, no se reinstalan.
# El .npmrc entra CON ellas: si llegara después (con el COPY . . de abajo),
# `ignore-scripts=true` no se aplicaría y npm ci ejecutaría los postinstall.
COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .
RUN npm run build

# ---- 2) nginx sirviendo el estático, SIN root ----
# Imagen «unprivileged»: el master de nginx corre como usuario 101, no como root
# (guía docker.md, Tema 2 y perfil ★, obligatorio en lo expuesto a internet).
# Se mantiene el puerto 80 a propósito: el túnel de Cloudflare apunta a
# orbita-web:80 desde el panel, que no se toca desde aquí. Bindear el 80 sin
# root necesita la capacidad NET_BIND_SERVICE, que se concede en el compose.
# 1.30 = rama estable de nginx (la 1.27 ya no recibe arreglos). Por digest,
# porque es lo único de cara a internet.
FROM nginxinc/nginx-unprivileged:1.30-alpine@sha256:4714e0b1b2577eaa1a6131d07c958b67f0eb68e6d0521e90c6e5287db8cf0bc5
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY seguridad.conf /etc/nginx/seguridad.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
