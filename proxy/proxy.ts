// run: 
// ts-node proxy.ts

import { createProxyMiddleware } from 'http-proxy-middleware'
import express from 'express'
import cors from 'cors'
import nsg from 'node-sprite-generator'
import fs from 'fs'
import Axios from 'axios'

import { hashes } from '../src/mock/images/imgHash'
import { imageExtractor } from '../src/common/functions/ex'

let images_source = 'https://rixtrema.net/'
let hash_links:Array<string> = []
let local_images: Array<string> = []

hashes.forEach((hash) =>{
  hash_links.push(`${images_source}${imageExtractor(hash,45)}`)
  local_images.push(`sources/${hash}.jpg`)
})

let port = 666
console.log( `proxy service started on port ${port}` )
console.log( `number of hashes: ${hashes.length}` )

const app: express.Application = express()

app.use(cors())

app.get('/remake', async (req, res) => {
  let message = 'remake sprite started now'
  console.log(message)
  res.send(message)
  
  let downloadPromises: Array<Promise<any>> =[]

  hash_links.forEach((link, n) => {
    let file = fs.createWriteStream(`sources/${hashes[n]}.jpg`)
    
    let pr = new Promise((resolve, reject) => {
        Axios({
          method: 'get',
          url: link,
          responseType:'stream'
        })
        .then(res => {
          res.data.pipe(file)
          console.log(`${hashes[n]} downloaded`);
          resolve();
        })
        .catch((error) => {
          reject(error);
        })
    })
    .catch(error => {
      console.log(`Downloading error: ${error}`);
      console.log(`Downloaded file: ${link}`);  
    });
    downloadPromises.push(pr)
  })

  await Promise.all(downloadPromises)

  console.log(`all files downloaded`)

  nsg({
      src: local_images,
      spritePath: 'images/sprite.png',
      stylesheet: 'sass',
      stylesheetPath: 'stylus/sprite.styl'
  }, function (err) {
      console.log('sprite generated!');
  });
});

app.use('/', createProxyMiddleware({
    target: images_source,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug'
  })
);

app.listen(port)