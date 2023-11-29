#!/bin/bash

set -e

REPO_DIR=${REPO_DIR:-$(git rev-parse --show-toplevel)}
BUILD_DOR="$REPO_DIR/build"

mkdir -p $BUILD_DOR
cd $BUILD_DOR
cmake ..
make -j ${nproc}
cpack -G DEB
