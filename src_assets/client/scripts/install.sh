#!/bin/bash

set -e

SCRIPT_DIR="$(cd $(dirname ${BASH_SOURCE[0]}) &>/dev/null && pwd)"
STREAMER_DEB=$SCRIPT_DIR/Streamer.deb
CLIENT_DEB=$SCRIPT_DIR/Client.deb
DESKTOP_FILE=$SCRIPT_DIR/gac-streaming-client.desktop

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

sudo cp -rf $DESKTOP_FILE /etc/xdg/autostart/
sudo sudo dpkg --force-confold -i $STREAMER_DEB
echo "install $STREAMER_DEB done"
sudo sudo dpkg --force-confold -i $CLIENT_DEB
echo "install $CLIENT_DEB done"

$SCRIPT_DIR/rndis/setup.sh
echo "install rndis done"
