#!/bin/bash
cd ${0%/*}

cd ../desktop

# npm run start -- --full --restart_time 23:59:59 --screen 2 --d settings/2021/0-skin-tone-left.json
npm run start -- --restart_time 23:59:59 --screen 2 --d settings/2021/0-skin-tone-left.json --ddebug
