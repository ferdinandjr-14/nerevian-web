# Estructura monolítica: PHP + Nginx + Node (para compilar Vue)
FROM php:8.2-fpm-alpine

# Instalar dependencias del sistema y Nginx
RUN apk add --no-cache \
    nginx \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    curl \
    nodejs \
    npm

# Instalar extensiones de PHP para Laravel
RUN docker-php-ext-install pdo_mysql bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar directorio de trabajo
WORKDIR /var/www

# Copiar el código del proyecto
COPY . .

# Instalar dependencias de PHP y JS, y compilar el frontend
RUN composer install --no-dev --optimize-autoloader
RUN npm install && npm run build

# Configurar Nginx (necesitarás un archivo de config simple)
COPY ./docker/nginx.conf /etc/nginx/http.d/default.conf

# Dar permisos a Laravel
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Exponer el puerto 80
EXPOSE 80

# Comando para arrancar PHP-FPM y Nginx a la vez
CMD php-fpm -D && nginx -g "daemon off;"