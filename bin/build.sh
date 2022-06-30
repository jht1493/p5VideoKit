#!/bin/bash
cd ${0%/*}

dest=../node
if [ ! -e "$dest/node_modules" ]; then
  pushd $dest > /dev/null
  npm install
  popd > /dev/null
fi

node ../node/build.js
