#!/bin/bash
cd ${0%/*}

cd ../desktop

# ./node_modules/.bin/electron electron-main --full --restart_time 23:59:59 --screen 1 --s 0-color-line-1900
# ./node_modules/.bin/electron electron-main --edebug --restart_period 1:00 --screen 1 --root https://www.blackfacts.com
# ./node_modules/.bin/electron electron-main --full --screen 1 --restart_period 23:59:59 --root https://www.blackfacts.com
./node_modules/.bin/electron electron-main --full --screen 1 --restart_period 5:0 --root https://www.blackfacts.com
 

