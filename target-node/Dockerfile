FROM ubuntu:24.04

RUN apt update && apt install -y openssh-server sudo

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

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
