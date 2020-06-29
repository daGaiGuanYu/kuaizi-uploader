const FS = require('fs')
const Path = require('path')

module.exports = class {
  constructor(dir){
    // 检查一：绝对路径
    if(!Path.isAbsolute(dir))
      throw Error('请使用绝对路径')
    // 检查三：是文件夹？
    const stat = FS.statSync(dir)
    if(!stat.isDirectory())
      throw Error(dir + ' 必须是一个文件夹')
    // 补充后尾的斜线
    if(dir[dir.length-1] != '/')
      dir += '/'

    this.dir = dir
  }

  write(req, filename){
    return new Promise( (resolve, reject) => {
      const path = this.dir + filename
      req.pipe(FS.createWriteStream(path, { flags: 'wx' }))
      req.on('end', resolve)
      req.on('error', reject)
    })
  }
}