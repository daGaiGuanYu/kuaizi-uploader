const FS = require('fs')
const Path = require('path')

module.exports = class {
  constructor(dir){
    if(!Path.isAbsolute(dir)) // 检查一：绝对路径
      throw Error('请使用绝对路径')
    FS.stat(dir, (err, stat) => {
      if(err) // 检查二：文件夹不存在等
        throw err
      if(!stat.isDirectory()) // 检查三：是文件夹？
        throw Error(dir + '不是一个文件夹？')

      if(dir[dir.length-1] != '/') // 补充后尾的斜线
        dir += '/'

      this.dir = dir
    })
  }

  write(req, filename){
    return new Promise( resolve => {
      const path = this.dir + filename
      req.pipe(FS.createWriteStream(path, { flags: 'wx' }))
      req.on('end', resolve)
    })
  }
}