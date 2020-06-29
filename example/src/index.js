const Path = require('path')
const { HandleRequest, Server, Constant, Exception } = require('kuaizi')
const writeStaticFile = require('kuaizi-dev-static')
const UploadedFileWriter = require('../../src/index')

// 启动服务器
Server.start()

// 处理请求：网页文件下载
const staticPosition = Path.join(__dirname, './static') // html 所在位置
HandleRequest.get('/static', ctx => {
  writeStaticFile(ctx.req, ctx.res, staticPosition)
  return Constant.Nothing
})

// 处理请求：上传文件
const uploadedPosition = Path.join(__dirname, './uploaded') // 存储上传文件的位置
const writer = new UploadedFileWriter(uploadedPosition) // 实例化 kuaizi-uploader（禁止在 handler 里实例化）
HandleRequest.post('/upload', async ctx => {
  const suffix = ctx.getQuery().suffix // 需要以某种方式把文件的后缀名传过来
  if(!suffix)
    throw new Exception.NBug('未知错误', null, '前端上传文件时，未传入文件后缀')

  const filename = new Date().getTime() + '.' + suffix // 生产环境请使用更严谨的文件命名方式
  await writer.write(ctx.req, filename)
})