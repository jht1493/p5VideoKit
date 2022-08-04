#!/bin/bash
cd ${0%/*}

cd ..

bin/build.sh --prod
bin/to-public.sh
bin/pub-html.sh

