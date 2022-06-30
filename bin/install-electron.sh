#!/bin/bash
cd ${0%/*}

dest=../src/
cd $dest

rm -rf node_modules/
npm install