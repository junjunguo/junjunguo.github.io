/**
 * load all file names to a folder to a list
 * Created by GuoJunjun on 06.12.14.
 */

// this is a server side function
function getFileNames(dir,files_){
    var fs = require('fs');
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for(var i in files){
        var name = files[i];
        files_.push(name);
    }
    return files_;
}
console.log(getFileNames('../image/fun'))
