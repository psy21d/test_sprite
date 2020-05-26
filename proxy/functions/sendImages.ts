import fs from 'fs'
import { images_source } from '../settings/main'

export const sendImages = async (ws: any) => {

    let buff = fs.readFileSync('sources/0a90d24eaf5088ac184ff0366880999b.jpg');
    let base64data = buff.toString('base64');

    ws.send(JSON.stringify ({
        event:"file",
        content: base64data
      })
    )
    
    console.log('all images sended')
}