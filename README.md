# Dockerized Ansible Testing Lab for Playbook Development

This repository provides a Docker-based environment for testing Ansible playbooks and configurations. 
It uses Docker and Docker Compose to set up a simple Ansible control node and several target nodes.

## Prerequisites

Make sure you have Docker and Docker Compose installed on your system. You can verify their versions with the following commands:

```bash
$ docker -v
Docker version 27.3.1, build ce12230
$ docker compose version
Docker Compose version 2.29.7
```

## Getting Started

### 1. Build the Docker Environment

To build the environment from scratch, run the following command:

```bash
$ docker compose build --no-cache
```

This will create the Ansible control node named `ansible` and target nodes named `node01`, `node02`, and `proxy`.

### 2. Start the Docker Containers

Once the build is complete, start the containers in detached mode (background):

```bash
$ docker compose up -d
```

### 3. Verify Node Configuration

To verify the configuration of `node01`, you can connect it using the following command:

1. Access `node01` with `docker exec`:

    ```bash
    $ docker exec -it node01 /bin/bash
    ```

2. Check network connections:

    ```bash
    $ docker exec -it node01 netstat -tuln
    ```

3. Verify important files (SSH configuration, hosts, authorized keys) on the node:

    ```bash
    root@node01:/# ps aux | grep sshd
    root@node01:/# cat /etc/ssh/sshd_config
    root@node01:/# cat /root/.ssh/authorized_keys
    ```

### 4. Run Ansible Commands

Access the Ansible control node named `ansible` using:

```bash
$ docker exec -it ansible /bin/bash
```

The control node is also accessible through a web browser at `http://localhost:8990/`.

Check the installed Ansible version:

```bash
# ansible --version
```

Test if you can reach the target nodes by pinging them:

```bash
# ansible node -m ping
```

You should see successful ping responses from both `node01` and `node02`.

### 5. Execute a Playbook

To run an Ansible playbook, navigate to the `work` directory and execute the following command:

```bash
# cd work
# ansible-playbook -i inventory/dev/inventory.yml play_check.yml
```

### Examples

**Deploying Nginx:**

Run the following command in the `work` directory to deploy Nginx on all target nodes using a playbook:

```bash
# cd work
# ansible-playbook -i inventory/dev/inventory.yml play_web.yml
```

After successful execution, you should be able to access Nginx on `http://localhost:8001` and `http://localhost:8002`.

**Deploying Nginx Reverse Proxy:**

Use this command in the `work` directory to deploy a reverse proxy server with Nginx using a playbook:

```bash
# cd work
# ansible-playbook -i inventory/dev/inventory.yml play_proxy.yml
```

After successful execution, the reverse proxy should be accessible at `https://localhost`.

**Windows Users:**

On Windows, import the `localCA.crt` certificate from the `docker-ansible-proxy` container into the `Trusted Root Certification Authorities` store. You can access the certificate with:

1. Use `docker cp` to copy the certificate from the container:

    ```bash
    # docker cp <docker-ansible-proxy container id>:/etc/nginx/ssl/localCA.crt ./
    ```

2. Open the Certificate Manager (press `Windows + R` and run `certlm.msc`).

## Troubleshooting

- Check if the containers are running using `docker ps`.
- Ensure the network configuration allows communication between the control node and target nodes.

## Conclusion

This setup provides a quick way to create a testing environment for Ansible with Docker. You can customize the environment by modifying the `Dockerfile` or `docker-compose.yml` files based on your specific playbooks and needs.
