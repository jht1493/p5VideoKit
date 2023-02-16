#!/bin/bash
cd ${0%/*}

cd ../desktop

# npm run start -- --full --restart_time 23:59:59 --screen 1 --s 0-color-line-1900
# npm run start -- --full --restart_period 6:0:0 --screen 1 --d settings/2021/1-data-posenet.json 
npm run start -- --restart_period 6:0:0 --screen 1 --d settings/2021/1-data-posenet.json --ddebug
