# Dockerized Ansible Testing Environment for Playbook Development

This repository provides a Docker-based environment to test Ansible playbooks and configurations. It sets up a simple Ansible control node and two target nodes using Docker and Docker Compose.

## Prerequisites

Ensure you have Docker and Docker Compose installed on your system:

```bash
$ docker -v
Docker version 27.2.1, build 9e34c9bb39
$ docker compose version
Docker Compose version 2.29.5
```

## Getting Started

### 1. Build the Docker Environment

To build the environment from scratch, run the following command:

```bash
$ docker compose build --no-cache
```

This will create the Ansible control node (`ansible`) and target nodes (`node01` and `node02`).

### 2. Start the Docker Containers

Once the build is complete, start the containers in detached mode:

```bash
$ docker compose up -d
```

### 3. Verify Node Configuration

To verify the configuration of `node01`, you can access it using the following command:

```bash
$ docker exec -it node01 /bin/bash
```

From the node, check important files like SSH configuration, hosts, and authorized keys:

```bash
root@node01:/# ps aux | grep sshd
root@node01:/# cat /etc/ssh/sshd_config
root@node01:/# cat /etc/hosts
root@node01:/# cat /root/.ssh/authorized_keys
```

### 4. Run Ansible Commands

Access the Ansible control node:

```bash
$ docker exec -it ansible /bin/bash
```

Check the Ansible version installed:

```bash
ansible:~/work# ansible --version
```

You can now use Ansible to ping the target nodes and ensure they are reachable:

```bash
ansible:~/work# ansible node -m ping
```

You should see successful pings from both `node01` and `node02`:

```bash
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
```

### 5. Execute a Playbook

To run an Ansible playbook (e.g., `ping.yml`), use the following command:

```bash
ansible:~/work# ansible-playbook ping.yml
```

Expected output will confirm the connection to the nodes and the results of the tasks:

```plaintext
PLAY [node] *********************************************************************************************************

TASK [Gathering Facts] **********************************************************************************************
ok: [node02]
ok: [node01]

TASK [Test connection to target nodes] ******************************************************************************
ok: [node01]
ok: [node02]

TASK [debug] ********************************************************************************************************
ok: [node01] => {
    "msg": {
        "changed": false,
        "failed": false,
        "ping": "pong"
    }
}
ok: [node02] => {
    "msg": {
        "changed": false,
        "failed": false,
        "ping": "pong"
    }
}

PLAY RECAP **********************************************************************************************************
node01                     : ok=3    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0   
node02                     : ok=3    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0    
```

### Example: Deploying Nginx

The following example shows how to deploy Nginx on the target nodes using an Ansible playbook. 

First, run a syntax check on the playbook to ensure there are no errors:

```bash
ansible:~/work# ansible-playbook nginx.yml --syntax-check
```

Then, execute the playbook to install Nginx, prompting for both SSH and sudo passwords:

```bash
ansible:~/work# ansible-playbook nginx.yml -k --ask-become-pass
```

Once the playbook has successfully run, Nginx should be accessible at `http://localhost:8101` and `http://localhost:8102`.

## Troubleshooting

- If the nodes are unreachable, ensure the Docker containers are running by checking with `docker ps`.
- Ensure the network settings allow communication between the Ansible control node and the target nodes.

## Conclusion

This setup allows you to quickly create a testing environment for Ansible using Docker. You can modify the `Dockerfile` or `docker-compose.yml` as needed to customize the setup for your playbooks and environments.
