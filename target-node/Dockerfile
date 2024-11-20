FROM ubuntu:24.04

RUN apt update && apt install -y openssh-server sudo net-tools curl supervisor \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt install -y nodejs

WORKDIR /app
COPY ./webshell /app
ARG WS_PORT=8999
RUN npm install \
    && { \
        echo 'NODE_ENV=production'; \
        echo 'WS_URL=localhost'; \
        echo "WS_PORT=${WS_PORT}"; \
    } > /app/.env.production \
    && npm run build

RUN mkdir -p /root/.ssh/ \
    && touch /root/.ssh/authorized_keys \
    && { \
        echo 'PermitRootLogin yes'; \
        echo 'PasswordAuthentication yes'; \
        echo 'AuthorizedKeysFile /root/.ssh/authorized_keys'; \
        echo 'PubkeyAuthentication yes'; \
    } >> /etc/ssh/sshd_config

RUN mkdir -p /run/sshd

RUN echo 'root:node' | chpasswd

EXPOSE 22 80 8999

RUN mkdir -p /etc/supervisor/conf.d/
COPY ./target-node/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
