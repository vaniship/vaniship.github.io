/* global System */
(function () {
  'use strict'

  var script = document.createElement('script')
  script.src = 'node_modules/systemjs/dist/system.min.js'
  document.head.appendChild(script)

  var commonLibs = {
    '@mdblog/mdblog': './node_modules/@mdblog/mdblog/dist/main.min.js',
    'axios': 'node_modules/axios/dist/axios.min.js',
    'blueimp-md5': 'node_modules/blueimp-md5/js/md5.min.js',
    'bootstrap-vue': 'node_modules/bootstrap-vue/dist/bootstrap-vue.min.js',
    'bootstrap': 'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'he': 'node_modules/he/he.js',
    'jquery': 'node_modules/jquery/dist/jquery.min.js',
    'jsonic': 'node_modules/jsonic/jsonic-min.js',
    'marked': 'node_modules/marked/marked.min.js',
    'prismjs': 'node_modules/prismjs/prism.js',
    'prismjs/': 'node_modules/prismjs/',
    'qs': 'node_modules/qs/dist/qs.js',
    'vue': 'node_modules/vue/dist/vue.min.js'
  }

  window.onload = function () {
    document.body.innerHTML = '<div id="app" />'

    var _resolve = System.resolve
    System.resolve = function (id, parentURL) {
      var commonLib = commonLibs[id]
      if (!commonLib) {
        for (var key in commonLibs) {
          if (/\/$/.test(key) && id.startsWith(key)) {
            commonLib = commonLibs[key] + id.substr(key.length)
            if (!/\.js$/i.test(commonLib)) commonLib += '.js'
          }
        }
      }
      return commonLib || _resolve.call(System, id, parentURL)
    }

    System.instantiate = function (url, firstParentUrl) {
      var loader = this
      return new Promise(function (resolve, reject) {
        var script = document.createElement('script')
        script.charset = 'utf-8'
        script.async = false
        script.addEventListener('error', function () {
          reject(new Error('Error loading ' + url + (firstParentUrl ? ' from ' + firstParentUrl : '')))
        })
        script.addEventListener('load', function () {
          document.head.removeChild(script)
          resolve(loader.getRegister())
        })
        script.src = url
        document.head.appendChild(script)
      })
    }
    System.commonLibs = commonLibs
    System.import('@mdblog/mdblog')
  }
})()
