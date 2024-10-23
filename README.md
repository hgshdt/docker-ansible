# docker-ansible

## Environment

```sh
$ docker -v
Docker version 27.2.1, build 9e34c9bb39
$ docker compose version
Docker Compose version 2.29.5
```

## Build

```sh
$ docker compose build --no-cache
```

## Run

```sh
$ docker-compose up -d
```

## Check node

```sh
$ docker exec -it node01 /bin/bash
# cat /etc/ssh/sshd_config
...
PermitRootLogin yes
PasswordAuthentication no
AuthorizedKeysFile /root/.ssh/authorized_keys
PubkeyAuthentication yes
# cat /etc/hosts
...
172.19.0.4	ansible
172.19.0.3	node01
172.19.0.2	node02
# cat /root/.ssh/authorized_keys
ecdsa-sha2-nistp521 ...
```

## Run Ansible

```sh
$ docker exec -it ansible /bin/bash
# ansible node -m ping
node02 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3.12"
    },
    "changed": false,
    "ping": "pong"
}
node01 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3.12"
    },
    "changed": false,
    "ping": "pong"
}
# ansible-playbook playbook.yml
PLAY [node] ************************************************************************************************************************************************************************

TASK [Gathering Facts] *************************************************************************************************************************************************************
ok: [node01]
ok: [node02]

TASK [Test connection to target nodes] *********************************************************************************************************************************************
ok: [node01]
ok: [node02]

PLAY RECAP *************************************************************************************************************************************************************************
node01                     : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
node02                     : ok=2    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0 
```
