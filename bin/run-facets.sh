#!/bin/bash
cd ${0%/*}

cd ../src

./node_modules/.bin/electron electron-main --full --restart_time 23:59:59 --screen 1 --s 0-facet-hd 
# ./node_modules/.bin/electron electron-main --full --restart_time 23:59:59 --screen 2 --s 0-bestill
