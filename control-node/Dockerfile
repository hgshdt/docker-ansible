FROM ubuntu:24.04

ENV ANSIBLE_PYTHON_INTERPRETER=auto_silent

RUN apt update && apt install -y openssh-client ansible sshpass curl net-tools netcat-traditional supervisor \
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

RUN mkdir -p /root/.ssh \
    && ssh-keygen -f /root/.ssh/id_ecdsa -t ecdsa -b 521 -N '' \
    && cp -p /root/.ssh/id_ecdsa.pub /root/.ssh/authorized_keys

RUN mkdir -p /etc/ansible
ADD ./control-node/ansible.cfg /etc/ansible

ADD ./control-node/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8999

ENTRYPOINT ["/entrypoint.sh"]

# CMD ["/bin/bash"]
# CMD ["node", "/app/build/main.js"]

RUN mkdir -p /etc/supervisor/conf.d/
COPY ./control-node/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
