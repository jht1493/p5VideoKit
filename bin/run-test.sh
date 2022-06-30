#!/bin/bash
cd ${0%/*}

cd ../skt

# ./node_modules/.bin/electron main.js --full --restart_time 23:59:59 --screen 1 --s 0-color-line-1900
./node_modules/.bin/electron main.js --restart_period 1:0:0 --screen 1 --s 0-color-line-1900
