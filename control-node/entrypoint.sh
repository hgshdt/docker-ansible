#!/bin/bash

node=(node01 node02 proxy)
port=22

function setup_pubkey() {
    for i in ${node[@]} ;
    do 
        sshpass -p 'node' scp -P "$port" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -pr /root/.ssh/authorized_keys root@$i:/root/.ssh/authorized_keys ;
    done
}

function setup_sshd_config() {
    for i in ${node[@]} ;
    do
        sshpass -p 'node' ssh -p "$port" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $i "sed -i -e 's/PasswordAuthentication yes/PasswordAuthentication no/g' /etc/ssh/sshd_config" ;
    done   
}

# function reload_sshd() {
#     for i in ${node[@]} ;
#     do
#         sshpass -p 'node' ssh -p "$port" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $i service sshd reload ;
#     done
# }

# function setup_hosts() {
#     for i in ${node[@]} ;
#     do
#         bash -c "sshpass -p 'node' ssh -p \"$port\" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $i tail -1 /etc/hosts" >> /etc/hosts
#     done
#     for i in ${node[@]} ;
#     do
#         sshpass -p 'node' scp -P "$port" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -pr /etc/hosts root@$i:/etc/hosts ;
#     done
# }

function wait_for_ssh() {
    for i in ${node[@]} ; do
        echo "Waiting for SSH on $i:$port..."
        until nc -z $i $port; do
            echo "SSH not ready on $i:$port. Retrying..."
            sleep 3
        done
        echo "SSH is ready on $i:$port."
    done
}

wait_for_ssh
setup_pubkey
setup_sshd_config

# reload_sshd
# if [ $(grep -E 'node0[1-2]' /etc/hosts | wc -l) -eq 0 ]; then 
#     setup_hosts
# fi

exec "$@"
