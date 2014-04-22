#!/bin/bash

git log --pretty=format:'%b' | grep '#changelog' | sed 's/ #changelog //g' > changelog.txt