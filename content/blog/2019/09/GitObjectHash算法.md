# Git Object Hash 算法

## 参考

[object_storage](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects#_object_storage)

## 计算方式

文本方式

```js
const crypto = require('crypto')
const hash = crypto.createHash('sha1')

const content = "what is up, doc?"
hash.update(`blob ${content.length}\0`)

hash.update(content)
console.log(hash.digest().toString('hex')) // 返回 bd9dbf5aae1a3862dd1526723246b20206e5fc37
```

文件方式

```js
const fs = require('fs')
const crypto = require('crypto')
const hash = crypto.createHash('sha1')

const filePath = 'data.txt'
const content = "what is up, doc?"
fs.writeFileSync(filePath, content)

const stream = fs.createReadStream(filePath)

const stat = fs.statSync(filePath)
hash.update(`blob ${stat.size}\0`)

stream.pipe(hash).on('finish', () => {
  console.log(hash.read().toString('hex')) // 返回 bd9dbf5aae1a3862dd1526723246b20206e5fc37
})
```

使用 git 命令验证

```bash
echo -n "what is up, doc?" | git hash-object --stdin
# 返回 bd9dbf5aae1a3862dd1526723246b20206e5fc37
```
