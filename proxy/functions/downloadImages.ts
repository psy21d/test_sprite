import fs from 'fs'
import Axios from 'axios'
const path = require('path');
const directoryPath = path.join(__dirname, '/../sources/');

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


let clearImageDir = () => {
    fs.readdir(directoryPath, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directoryPath, file), err => {
                if (err) throw err;
            });
        }
    });
}

// переписать код на ООП
// пример proof-of-concept

export const downloadImages = async (req:any, res:any) => {
    
    res.send ('ok, server now download images')

    let downloadPromises: Array<Promise<any>> =[]
    let catch_links: Array<string> = []
    clearImageDir()
    let dlinks = hash_links
  
    let for_download = () => {
        dlinks.forEach((link, n) => {
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
                catch_links.push(link)
                reject(error);
            })
        })
        .catch(error => {
            console.log(`Downloading error: ${error}`);
            console.log(`Downloaded file: ${link}`);  
        });
        downloadPromises.push(pr)
        })
    }

    for (let i=0; i<200; i++) { // safe
      downloadPromises = []
      catch_links = []
      for_download()
      await Promise.all(downloadPromises)
      console.log(`${catch_links.length} errors count, retry`)
      if (!catch_links.length) break
      dlinks = catch_links
    }

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