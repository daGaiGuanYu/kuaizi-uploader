const Path = require('path')
const { HandleRequest, Server, Constant } = require('kuaizi')
const writeStaticFile = require('kuaizi-dev-static')
const writeUploadedFile = require('../../src/index')

Server.start()

const staticPosition = Path.join(__dirname, './static')
HandleRequest.get('/static', ctx => {
  writeStaticFile(ctx.req, ctx.res, staticPosition)
  return Constant.Nothing
})

const uploadedPosition = Path.join(__dirname, './uploaded')
HandleRequest.post('/upload', async ctx => {
  await writeUploadedFile(ctx.req, uploadedPosition + '/haha') // 这里不要轻易使用 Path.join 来连接
})