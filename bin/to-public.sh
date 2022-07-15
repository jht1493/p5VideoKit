#!/bin/bash
cd ${0%/*}

# rsync folder public to covid19-dashboard-public

delete=--delete
test=
verbose=
# test=--dry-runs
verbose=v

excludes="--exclude-from to-public-exclude.txt"

source=../

destRepo=p5VideoKit
rpath=../../$destRepo

echo $verbose $delete $test
echo "rsync from $source"
echo "        to $rpath"
rsync -razO$verbose $excludes $delete $test "$source/" "$rpath/"
