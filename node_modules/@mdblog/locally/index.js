'use strict'

const fs = require('fs-extra')
const path = require('path')
const md5 = require('blueimp-md5')
const glob = require('glob')

function log (msg) {
  process.stdout.write(msg)
}

log('build start ...\n')
log('clear dist dir ...')
fs.removeSync('dist')
log(' ok.\n')

log('copy base files ...')
fs.copySync('content', 'dist/content')
fs.copySync('config.json', 'dist/config.json')
fs.copySync('index.html', 'dist/index.html')
fs.copySync('favicon.ico', 'dist/favicon.ico')
log(' ok.\n')

const nodeModules = path.resolve('node_modules')
const packageJson = require(path.resolve('package.json'))
for (const dep of Object.keys(packageJson.dependencies)) {
  try {

    fs.copySync(path.join(nodeModules, dep, 'dist'), `dist/node_modules/${dep}/dist`)

    const config = require(path.join(nodeModules, dep, 'build/locally.config.js'))
    for (const item of config.dependencies) {
      glob(path.join(nodeModules, item), null, (err, files) => {
        if (!err) {
          for (const file of files) {
            try {
              fs.copySync(file, `dist/node_modules/${file.substr(nodeModules.length + 1)}`)
            } catch (e) {
              console.log(e)
            }
          }
        } else {
          console.log(err)
        }
      })
    }
  } catch (e) {
    // console.log(e)
  }
}

// 转换文件并删除源文件
log('deal files ...')
glob('dist/**/*.{md,json}', null, (err, files) => {
  if (err) throw err
  files.forEach((file) => {
    const md = fs.readFileSync(file) + ''
    const hash = md5(path.relative('dist', file).replace(/\\/g, '/'))
    fs.outputFileSync(`dist/mock/${hash}.js`, `jsonpcallback_${hash}(${JSON.stringify(md)})`)
    fs.removeSync(file)
  })
  log(' ok.\n')

  // 清理空目录
  log('clear empty dir ...')
  glob('dist/**/', null, (err, files) => {
    files = files.sort((a, b) => b.length - a.length)
    console.log(files)
    if (err) throw err
    files.forEach((file) => {
      if (fs.readdirSync(file).length === 0) {
        fs.removeSync(file)
      }
    })
    log(' ok.\n')
    log('build success.\n')
  })
})
