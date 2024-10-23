FROM alpine:3.20

ENV ANSIBLE_PYTHON_INTERPRETER=auto_silent

RUN apk add --no-cache openssh-client ansible sshpass bash

RUN mkdir -p /root/.ssh \
    && ssh-keygen -f /root/.ssh/id_ecdsa -t ecdsa -b 521 -N '' \
    && cp -p /root/.ssh/id_ecdsa.pub /root/.ssh/authorized_keys

RUN mkdir -p /etc/ansible
ADD ansible.cfg /etc/ansible

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/bin/bash"]
