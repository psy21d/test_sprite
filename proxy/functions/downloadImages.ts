import fs from 'fs'
import Axios from 'axios'

import { images_source } from '../settings/main'
import { imageExtractor } from '../../src/common/functions/ex'
import { hashes } from '../../src/mock/images/imgHash'

// https://github.com/nodejs/node-v0.x-archive/issues/5545

let hash_links:Array<string> = []
let local_images: Array<string> = []

hashes.forEach((hash) =>{
    hash_links.push(`${images_source}${imageExtractor(hash,45)}`)
    local_images.push(`sources/${hash}.jpg`)
})

export const downloadImages = async (req:any, res:any) => {
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
            responseType:'stream',
          })
          .then(res => {
            res.data.pipe(file)
            console.log(`${hashes[n]} downloaded`);
            file.on('finish', resolve)
            file.on('error', reject)
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
  
    // nsg({
    //     src: local_images,
    //     spritePath: 'images/sprite.png',
    //     stylesheet: 'sass',
    //     stylesheetPath: 'stylus/sprite.styl'
    // }, function (err) {
    //     console.log(err);
    //     console.log('sprite generated!');
    // });
}