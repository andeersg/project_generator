FROM php:8.1-cli

SHELL ["/bin/bash", "-c"]

# Install composer
COPY --from=composer:2.5.4 /usr/bin/composer /usr/local/bin/composer

RUN apt update

# Install things mariadb-server \
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
apt install -y \
        git \
        nodejs \
        libpng-dev \
        libzip-dev \
        zlib1g-dev \
        zip \
  && docker-php-ext-install zip \
  && docker-php-ext-install gd

# Install mysql

RUN useradd -ms /bin/bash creator

WORKDIR /workspace

RUN chown -R creator:creator /workspace

USER creator

COPY --chown=creator:creator . /workspace/

# Maybe not necessary, could be created by the script.
# RUN mkdir build && chmod -R 777 build && mkdir output && chmod -R 777 output

RUN npm install

CMD [ "/usr/bin/node", "entrypoint.js" ]