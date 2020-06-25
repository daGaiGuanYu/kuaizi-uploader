const FS = require('fs')

module.exports = function(req, targetPath){
  return new Promise( resolve => {
    req.pipe(FS.createWriteStream(targetPath, { flags: 'wx' }))
    req.on('end', resolve)
  })
}