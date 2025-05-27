# kuaizi-session
[node](https://nodejs.org/en/) web 后端，把前端上传的文件存到硬盘里  
跟[筷子](https://github.com/daGaiGuanYu/kuaizi)没有依赖关系，只是理念一致~

# 使用
## 安装
```bash
npm install kuaizi-uploader
```

### 在筷子中的应用
```javascript
// index.js
const Path = require('path')
const { HandleRequest, Server, Exception } = require('kuaizi')
const UploadedFileWriter = require('kuaizi-uploader')

// 启动服务器
Server.start()

// 处理请求：上传文件
const uploadedPosition = Path.join(__dirname, './uploaded') // 存储被上传文件的位置（绝对路径）
const writer = new UploadedFileWriter(uploadedPosition) // 实例化 kuaizi-uploader（禁止在 handler 里实例化）
HandleRequest.post('/upload', async ctx => {
  const suffix = ctx.getQuery().suffix // 需要以某种方式把文件的后缀名传过来
  if(!suffix)
    throw new Exception.NBug('未知错误', null, '前端上传文件时，未传入文件后缀')

  const filename = new Date().getTime() + '.' + suffix // 生产环境请使用更严谨的文件命名方式
  await writer.write(ctx.req, filename)
  
  // return '一般会把文件的下载链接返回给前端'
})
```

```html
<!DOCTYPE html>
<html>
  <input type="file" onchange="handleChange(event)"></input>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script>
  function handleChange(e){
    const file = e.target.files[0]
    const nameArr = file.name.split('.')
    const suffix = nameArr[nameArr.length-1] // 解析文件后缀
    axios.post('/upload?suffix=' + suffix, file, {
      'Content-Type': 'application/octet-stream' // !
    }).then( res => {
      res = res.data
      if(res.code == 0)
        console.log('success')
      else
        console.error(res.msg)
    })
  }
  </script>
</html>
```
