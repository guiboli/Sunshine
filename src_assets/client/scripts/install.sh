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

sudo sudo dpkg --force-confold -i $SUNSHINE_DEB
echo "install $SUNSHINE_DEB done"
sudo sudo dpkg --force-confold -i $CLIENT_DEB
echo "install $CLIENT_DEB done"
