#!/bin/bash
cd ${0%/*}

# Publish html app to jht1493.net

# external/media
#   is managed manually
# excludes="--exclude .DS_Store --exclude .git"
excludes="--exclude-from to-public-exclude.txt"

delete=--delete
test=
verbose=
# test=--dry-run
verbose=v

start_time=`date +%s`

host=jhtitp@34.236.53.81
siteroot=/home/bitnami/htdocs
homepage=p5VideoKit/demo/external/media
src_path="${siteroot}/${homepage}"
src_host=$host:${src_path}

# src/external/media
dest_path=../src/external/media

mkdir -p $dest_path

# echo $verbose $delete $test
echo -razO$verbose $excludes $delete $test
echo "rsync from $src_host"
echo "        to $dest_path"
rsync -razO$verbose $excludes $delete $test "$src_host/" "$dest_path/"

echo
echo Lapse $(expr `date +%s` - $start_time) 
echo build_ver `cat ../build/build_ver.txt`
echo "open https://jht1493.net/${homepage}"


