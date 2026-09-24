# ---- Stage 1: compile TypeScript ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* tsconfig.json ./
RUN npm install
COPY src ./src
COPY public ./public
RUN npm run build

# ---- Stage 2: PHP + Apache ----
FROM php:8.3-apache
ENV DATA_DIR=/var/www/data
COPY --from=build /app/public /var/www/html
RUN mkdir -p /var/www/data && chown -R www-data:www-data /var/www/data

# Render injects $PORT (default 10000); make Apache listen on it.
ENV PORT=10000
RUN sed -ri 's/Listen 80/Listen ${PORT}/' /etc/apache2/ports.conf \
 && sed -ri 's/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/' /etc/apache2/sites-available/000-default.conf
EXPOSE 10000

CMD ["apache2-foreground"]
