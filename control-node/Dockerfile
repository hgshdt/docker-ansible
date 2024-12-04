FROM ubuntu:24.04

ENV ANSIBLE_PYTHON_INTERPRETER=auto_silent

RUN apt update \
    && apt install -y openssh-client ansible sshpass curl net-tools netcat-traditional make node-gyp \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt install -y nodejs \
    && apt clean

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

RUN mkdir -p /root/.ssh \
    && ssh-keygen -f /root/.ssh/id_ecdsa -t ecdsa -b 521 -N '' \
    && cp -p /root/.ssh/id_ecdsa.pub /root/.ssh/authorized_keys

RUN mkdir -p /etc/ansible
COPY ./control-node/ansible.cfg /etc/ansible

COPY ./control-node/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8999

ENTRYPOINT ["/entrypoint.sh"]

CMD ["node", "/app/build/main.js"]
