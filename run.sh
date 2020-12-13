#!/bin/bash

echo "Running step 1"
node index.js 1
sleep 1
echo "Running step 2"
node index.js 2
sleep 1
echo "Running step 3"
node index.js 3
echo "Done"