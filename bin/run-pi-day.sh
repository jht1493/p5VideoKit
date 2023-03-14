#!/bin/bash
cd ${0%/*}

cd ../desktop

# npm run start -- --full --restart_time 23:59:59 --screen 1 --s 0-color-line-1900
# npm run start -- --ddebug --restart_period 1:00 --screen 1 --root https://www.blackfacts.com
# npm run start -- --full --screen 1 --restart_period 23:59:59 --root https://www.blackfacts.com
npm run start -- --full --screen 1 --restart_time 01:00:00 --root "https://blackfacts.com/kiosk?delay=2000&playlist=DNa4WYXCC7Q,nYCiHtLtJYQ"
 
# https://www.youtube.com/watch?v=DNa4WYXCC7Q
# Pi Day Animation Created in FableVision Learning's Animation-ish

# https://www.youtube.com/watch?v=nYCiHtLtJYQ
# 20 Facts about Pi - Happy Pi Day!
