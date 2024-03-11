#!/usr/bin/env bash

set -ex

while :; do
  adb wait-for-usb-device devices -l
  adb wait-for-usb-device shell svc usb setFunctions rndis
  while ! ifconfig usb0; do
    sleep 1
  done
  adb wait-for-usb-disconnect
  echo Disconnected
done
