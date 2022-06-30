#!/bin/bash
cd ${0%/*}

dest=../src/external/lib

curl https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.3.1/p5.js -o $dest/p5.js
curl https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.3.1/addons/p5.sound.min.js -o $dest/p5.sound.min.js
# !!@ Update to latest p5js lib pending
# https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js
# https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/addons/p5.sound.min.js

curl https://p5livemedia.itp.io/simplepeer.min.js -o $dest/simplepeer.min.js
curl https://p5livemedia.itp.io/socket.io.js -o $dest/socket.io.js
# Skip map socket.io.js.map
# curl https://p5livemedia.itp.io/socket.io.js.map -o $dest/socket.io.js.map

# Use most recent p5livemedia.js
# curl https://p5livemedia.itp.io/p5livemedia.js -o $dest/p5livemedia.js
curl https://raw.githubusercontent.com/vanevery/p5LiveMedia/master/public/p5livemedia.js  -o $dest/p5livemedia.js

# curl https://unpkg.com/ml5@latest/dist/ml5.min.js -o $dest/ml5.min.js
# https://unpkg.com/ml5@latest/dist/ml5.min.js
# https://unpkg.com/ml5@0.12.2/dist/ml5.min.js
curl https://unpkg.com/ml5@0.12.2/dist/ml5.min.js -o $dest/ml5.min.js
curl https://unpkg.com/ml5@0.12.2/dist/ml5.min.js.map -o $dest/ml5.min.js.map

