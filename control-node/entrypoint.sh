#!/bin/bash

node=(node01 node02)

function setup_pubkey() {
    for i in ${node[@]} ;
    do 
        sshpass -p 'node' scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -pr /root/.ssh/authorized_keys root@$i:/root/.ssh/authorized_keys ;
    done
}

function setup_sshd_config() {
    for i in ${node[@]} ;
    do
        sshpass -p 'node' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $i "sed -i -e 's/PasswordAuthentication yes/PasswordAuthentication no/g' /etc/ssh/sshd_config" ;
    done   
}

# function reload_sshd() {
#     for i in ${node[@]} ;
#     do
#         sshpass -p 'node' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $i service sshd reload ;
#     done
# }

function setup_hosts() {
    for i in ${node[@]} ;
    do
        bash -c "sshpass -p 'node' ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $i tail -1 /etc/hosts" >> /etc/hosts
    done
    for i in ${node[@]} ;
    do
        sshpass -p 'node' scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -pr /etc/hosts root@$i:/etc/hosts ;
    done
}

setup_pubkey
setup_sshd_config
# reload_sshd
if [ $(grep -E 'node0[1-2]' /etc/hosts | wc -l) -eq 0 ]; then 
    setup_hosts
fi

exec "$@"
