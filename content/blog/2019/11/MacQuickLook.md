# Mac Quick Look

## 安装

```bash
brew cask install ${QuickLookPluginName}
```

## 调试

查看文件元信息，主要关注 ``kMDItemContentType`` 字段

```bash
mdls ${FileName}
```

查看 Quick Look 调试信息

```bash
qlmanage -p -d1 ${FileName}
```

查看文件所关联的 Quick Look 插件

```bash
qlmanage -m plugins
```

重新加载 Quick Look 插件

```bash
qlmanage -r cache
qlmanage -r
```

## 修改插件关联的文件

找到 Quick Look 插件所在目录，一般可能出现在如下目录中(也可以使用 ``qlmanage -m plugins`` 查看)：

```bash
/Library/QuickLook/
~/Library/QuickLook/
```

修改插件目录中的(``Contents/Info.plist``)文件,在(``/dict/CFBundleDocumentTypes/dict/CFBundleTypeRole/LSItemContentTypes/array``)里添加或删除待修改的文件类型

## Quick Look 插件开发

可参考 [Quick Look 插件开发](https://www.cnblogs.com/csuftzzk/p/how_to_make_quick_look_plugins.html)
