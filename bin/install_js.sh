#!/bin/bash
cd ${0%/*}

dest=../skt/assets/lib

curl https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.3.1/p5.js -o $dest/p5.js
curl https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.3.1/addons/p5.sound.min.js -o $dest/p5.sound.min.js
# https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js
# https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/addons/p5.sound.min.js

curl https://p5livemedia.itp.io/simplepeer.min.js -o $dest/simplepeer.min.js

curl https://p5livemedia.itp.io/socket.io.js -o $dest/socket.io.js
# curl https://p5livemedia.itp.io/socket.io.js.map -o $dest/socket.io.js.map

# curl https://p5livemedia.itp.io/p5livemedia.js -o $dest/p5livemedia.js

# curl https://unpkg.com/ml5@latest/dist/ml5.min.js -o $dest/ml5.min.js
# https://unpkg.com/ml5@latest/dist/ml5.min.js
# https://unpkg.com/ml5@0.12.2/dist/ml5.min.js
curl https://unpkg.com/ml5@0.12.2/dist/ml5.min.js -o $dest/ml5.min.js
curl https://unpkg.com/ml5@0.12.2/dist/ml5.min.js.map -o $dest/ml5.min.js.map

# http://127.0.0.1:5501/assets/lib/p5.sound.min.js.map
# http://127.0.0.1:5501/assets/lib/socket.io.js.map
# http://127.0.0.1:5501/assets/lib/ml5.min.js.map

# skt/assets/lib