import fs from 'fs'
const path = require('path');
const directoryPath = path.join(__dirname, '/../sources/');

export const sendImages = async (ws: any) => {

    fs.readdir(directoryPath, async function (err, files) {

        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 

        await Promise.all(files.map(async (file) => {
            let buff = fs.readFileSync(directoryPath+file);
            let base64data = buff.toString('base64');

            ws.send(JSON.stringify ({
                event:"file",
                filename: file,
                content: 'data:image/jpeg;base64,'+base64data
              })
            )
        }));

        ws.send(JSON.stringify ({
            event:"render"
          })
        )
    
        console.log('all images sended')
    });

}