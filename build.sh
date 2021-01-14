rm -rf ./collaborative-textarea.zip ./public
cd ./view
yarn build
mv ./build ../public
cd ../
tar --exclude ./server/node_modules -zcvf collaborative-textarea.tar.gz ./public ./server