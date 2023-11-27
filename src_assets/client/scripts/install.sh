#!/bin/bash

set -e

SCRIPT_DIR="$(cd $(dirname ${BASH_SOURCE[0]}) &>/dev/null && pwd)"
SUNSHINE_DEB=$SCRIPT_DIR/Sunshine.deb
CLIENT_DEB=$SCRIPT_DIR/Client.deb

if [ ! -f $SUNSHINE_DEB ]
then
  echo "$SUNSHINE_DEB not found"
  exit 1
fi
if [ ! -f $CLIENT_DEB ]
then
  echo "$CLIENT_DEB not found"
  exit 1
fi

sudo apt install -f $SUNSHINE_DEB
echo "install $SUNSHINE_DEB done"
sudo apt install -f $CLIENT_DEB
echo "install $CLIENT_DEB done"
