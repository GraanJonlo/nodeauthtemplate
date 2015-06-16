# file: .profile.d/ssh-setup.sh

#!/bin/bash
echo $0: creating public and private key files

# Create the .ssh directory
mkdir -p ${HOME}/.ssh
chmod 700 ${HOME}/.ssh

# Create the public and private key files from the environment variables.
echo "${HEROKU_PUBLIC_KEY}" > ${HOME}/.ssh/heroku_id_rsa.pub
chmod 644 ${HOME}/.ssh/heroku_id_rsa.pub

# Note use of double quotes, required to preserve newlines
echo "${HEROKU_PRIVATE_KEY}" > ${HOME}/.ssh/heroku_id_rsa
chmod 600 ${HOME}/.ssh/heroku_id_rsa

# Preload the known_hosts file  (see "version 2" below)
echo '|1|f7sPrK/fQVdZYBji13zEPF0iJWY=|BCISyVYiR7Hzo6YPqO+3tVqnySI= ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBCzGQbazZBCXtCHN99LcMq7PWm+Lidp2QMUNUYH0hLPTBA8dzQ4wyDypAR1vltGW2Lo/cJjtoe4tx0BB9+OAsrg=
|1|bFyYsgaQ8VGRFHt7AeJPk/1ImBs=|ym0k3wGz/AnMD3TpGYK8DKdQwQQ= ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBCzGQbazZBCXtCHN99LcMq7PWm+Lidp2QMUNUYH0hLPTBA8dzQ4wyDypAR1vltGW2Lo/cJjtoe4tx0BB9+OAsrg=' > ${HOME}/.ssh/known_hosts

# Start the SSH tunnel if not already running
SSH_CMD="ssh -f -i ${HOME}/.ssh/heroku_id_rsa -N compose@aws-eu-west-1-portal.1.dblayer.com -p 10113 -L 127.0.0.2:28015:10.16.240.34:28015 -L 127.0.0.3:28015:10.16.240.35:28015"

PID=`pgrep -f "${SSH_CMD}"`
if [ $PID ] ; then
    echo $0: tunnel already running on ${PID}
else
    echo $0 launching tunnel
    $SSH_CMD
fi
