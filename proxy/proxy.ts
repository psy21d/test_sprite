// run: 
// ts-node proxy.ts

// apt-get install libcairo2-dev libjpeg-dev libgif-dev
// mac: brew install cairo
// brew install imagemagick
// https://www.npmjs.com/package/canvas

// https://github.com/bamlab/generator-rn-toolbox/issues/117
// https://github.com/aheckmann/gm/issues/455

import { createProxyMiddleware } from 'http-proxy-middleware'
import express from 'express'
import * as WebSocket from 'ws';

import cors from 'cors'
// import nsg from 'node-sprite-generator'
// import spritesmith from 'spritesmith';

import { downloadImages } from './functions/downloadImages'
import { sendImages } from './functions/sendImages'
import { images_source } from './settings/main'

let port = 666
console.log(`proxy service started on port ${port}`)

const app: any = express()
app.set("port", port)

const server = require('http').createServer(app);

let wss = new WebSocket.Server({ server });

app.use(cors())

wss.on('connection', (ws: WebSocket) => {

  ws.on('message', (message: string) => {
      try {
        let event = JSON.parse(message).event

        // write full router
        if (event === 'send_images') {
            sendImages(ws)
        }
      } catch(e) {
        console.log(`Wrong incoming command`)
      }
  });
  
  ws.send('WebSocket server');
});

app.get('/remake', downloadImages );

app.use('/exeimages', createProxyMiddleware({
    target: images_source,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug'
  })
);

server.listen(port, () => {
  console.log(`Server started on port ${server.address().port}`);
});