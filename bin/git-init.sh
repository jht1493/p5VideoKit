#!/bin/bash
cd ${0%/*}

# /Users/jht2/Documents/projects/dice_face_aa/p5VideoKit-private
# https://github.com/jht1493/p5VideoKit-private.git

repo_name=p5VideoKit-private
repo_dir=p5VideoKit-private
# repo=covid19-dashboard-private

dest=../$repo_dir

if [ ! -e "$dest" ]; then
  echo "no $dest"
	exit 0
fi

cd $dest

# Prevent accidental use
exit 0

rm -rf .git
git init
git add .
git commit -m 'init'
git remote add origin https://github.com/jht1493/${repo_name}.git
git push --force --set-upstream origin main
