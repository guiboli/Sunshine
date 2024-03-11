#!/usr/bin/env bash

# shellcheck disable=SC2086,SC2046

set -ex

DIR=$(dirname "$(realpath "${BASH_SOURCE[0]}")")

if ! which adb; then
  sudo apt-get install -y adb
fi

mkdir -pv $HOME/.config/systemd/user/
for f in "$DIR"/*.service; do
  sed -i "s#ExecStart=.*#ExecStart=$HOME/.config/systemd/user/$(basename $(grep ExecStart $f))#g" $f
done
cp -uv $DIR/* $HOME/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable dm-rndis
loginctl enable-linger $USER

systemctl --user restart dm-rndis
sleep 1
systemctl --user status dm-rndis
