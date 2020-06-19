const Path = require('path');
const fs = require('fs-extra')

async function saveImageAs(forder,name,fileData) {
    const path = Path.resolve('./public/', forder, name);
    try {  
        await fs.copySync(fileData.path, path);
        return `/public/${forder}/${name}`;
    } catch (e){
        console.log(e);
        return false;
    }
}

module.exports={
    saveImageAs: saveImageAs
}