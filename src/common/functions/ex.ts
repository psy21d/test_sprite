export const imageExtractor = function(hash:string, size:number){

    if (hash && hash.length && hash.length > 20){
        return "exeimages/exeimages_" + size + '/' + hash.slice(0, 2) + '/' + hash.slice(2, 4) + '/' + hash + '.jpg';
    } else { 
        return '';
    }
}

//https://www.pixijs.com/

//size = 45

// https://rixtrema.net/exeimages/exeimages_init/48/91/4891db8fc7bf79357d2f2e1a004bc14c.jpg

// https://rixtrema.net/exeimages/exeimages_45/5e/63/5e639c5f69db734e2c19e0f39be758a2.jpg
