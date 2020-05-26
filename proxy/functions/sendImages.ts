import fs from 'fs'
const path = require('path');
const directoryPath = path.join(__dirname, '/../sources/');

export const sendImages = async (ws: any) => {

    fs.readdir(directoryPath, function (err, files) {

        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 

        files.forEach(function (file) {
            let buff = fs.readFileSync(directoryPath+file);
            let base64data = buff.toString('base64');

            ws.send(JSON.stringify ({
                event:"file",
                content: base64data
              })
            )
        });
    });    

    console.log('all images sended')
}