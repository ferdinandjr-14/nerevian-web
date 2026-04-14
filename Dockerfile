# Estructura monolítica: PHP + Nginx + Node
FROM php:8.2-fpm-alpine

# 1. Instalar dependencias del sistema (incluimos libzip para Composer)
RUN apk add --no-cache \
    nginx \
    libpng-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    curl \
    nodejs \
    npm

# 2. Instalar extensiones de PHP
RUN docker-php-ext-install pdo_mysql bcmath gd zip

# 3. Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. Configurar directorio de trabajo
WORKDIR /var/www

# 5. Copiar archivos de dependencias primero (Mejora la velocidad y evita fallos de ruta)
COPY composer.json package.json ./

# 6. Ejecutar Composer con flags de compatibilidad total
# Esto soluciona el "Exit code 1" en GitHub Actions
RUN composer install \
    --ignore-platform-reqs \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --prefer-dist

# 7. Copiar el resto del código
COPY . .

# 8. Instalar JS y compilar Frontend
RUN npm install && npm run build

# 9. Configurar Nginx
COPY ./docker/nginx.conf /etc/nginx/http.d/default.conf

# 10. Crear carpetas de Laravel si no existen y dar permisos
# Esto evita que el build falle si las carpetas están en el .gitignore
RUN mkdir -p storage bootstrap/cache && \
    chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Exponer el puerto 80
EXPOSE 80

# Comando para arrancar PHP-FPM y Nginx a la vez
CMD php-fpm -D && nginx -g "daemon off;"