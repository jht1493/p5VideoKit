#!/bin/bash
cd ${0%/*}

dest=../desktop/
cd $dest

rm -rf node_modules/
npm install