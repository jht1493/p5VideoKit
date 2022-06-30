#!/bin/bash
cd ${0%/*}

cd ../desktop

./node_modules/.bin/electron electron-main --full --restart_time 23:59:59 --screen 1 --s 0-skin-tone-right &
./node_modules/.bin/electron electron-main --full --restart_time 23:59:59 --screen 2 --s 0-skin-tone-left

