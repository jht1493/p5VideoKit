#!/bin/bash
cd ${0%/*}

cd ../skt

./node_modules/.bin/electron main.js --full --restart_time 23:59:59 --screen 1 --s 0-skin-tone-right &
./node_modules/.bin/electron main.js --full --restart_time 23:59:59 --screen 2 --s 0-skin-tone-left

