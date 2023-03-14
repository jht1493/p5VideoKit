#!/bin/bash
cd ${0%/*}

cd ../desktop

# npm run start -- --full --restart_time 23:59:59 --screen 1 --s 0-color-line-1900
# npm run start -- --ddebug --restart_period 1:00 --screen 1 --root https://www.blackfacts.com
# npm run start -- --full --screen 1 --restart_period 23:59:59 --root https://www.blackfacts.com
npm run start -- --full --screen 1 --restart_time 01:00:00 --root "https://blackfacts.com/kiosk?delay=2000&playlist=xIGJd4nP_f4"
 
# https://www.youtube.com/watch?v=xIGJd4nP_f4
# WEB DuBois: A Biography In Four Voices by Louis Massiah
