#!/bin/bash

cat <<EOF > /etc/systemd/system/sshd.service
[Unit]
Description=OpenSSH server daemon
After=network.target

[Service]
ExecStart=/usr/sbin/sshd -D
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable sshd
systemctl start sshd

echo "Custom services have been setup and started."
