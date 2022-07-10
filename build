#!/bin/bash
export $(cat .env) #Load environment variables to be used in build
rm -rf server/client_build
cd client
npm run build
mv build ../server/client_build