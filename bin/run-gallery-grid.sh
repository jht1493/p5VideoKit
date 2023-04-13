#!/bin/bash
cd ${0%/*}

cd ../desktop

# npm run start -- --full --restart_time 23:59:59 --screen 1 --s 0-color-line-1900
# npm run start -- --ddebug --restart_period 1:0:0 --screen 1 --d 2022/effects4-circle.json
# npm run start electron-main --ddebug 
npm run start -- --ddebug --d settings/movie-grid.json


