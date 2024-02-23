#!/bin/bash

set -e

SCRIPT_DIR="$(cd $(dirname ${BASH_SOURCE[0]}) &>/dev/null && pwd)"
STREAMER_DEB=$SCRIPT_DIR/Streamer.deb
CLIENT_DEB=$SCRIPT_DIR/Client.deb

if [ ! -f $STREAMER_DEB ]
then
  echo "$STREAMER_DEB not found"
  exit 1
fi
if [ ! -f $CLIENT_DEB ]
then
  echo "$CLIENT_DEB not found"
  exit 1
fi

sudo sudo dpkg --force-confold -i $STREAMER_DEB
echo "install $STREAMER_DEB done"
sudo sudo dpkg --force-confold -i $CLIENT_DEB
echo "install $CLIENT_DEB done"
