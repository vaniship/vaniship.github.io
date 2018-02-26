# Cordova 命令行接口 (CLI) 参考

## 语法

```bash
cordova <command> [options] -- [platformOpts]
```

## 全局命令列表

下面这些命令随时可用。

| 命令           | 说明                                            |
| -------------- | ----------------------------------------------- |
| create         | 创建工程                                        |
| help <command> | 获取相关命令的帮助                              |
| telemetry      | Turn telemetry collection on or off             |
| config         | 设置、获取、删除、编辑和列出全局 cordova 选项。 |

## 项目命令列表

当前工作目录是有效的 Cordova 项目时，支持以下命令。

| 命令         | 说明                                 |
| ------------ | ------------------------------------ |
| info         | 收集并打印项目信息                   |
| requirements | 检查项目所需依赖，并打印详细信息     |
| platform     | 管理项目平台。                       |
| plugin       | 管理项目插件。                       |
| prepare      | 将文件复制到平台目录以供编译。       |
| compile      | 编译项目中平台目录中的代码。         |
| clean        | 清理项目                             |
| run          | 运行项目 (会执行 prepare 和 compile) |
| serve        | 启动本地服务器 (会执行 prepare)      |

##  通用选项

这些选项适用于所有 cordova - cli 命令。

| 选项                 | 说明                                                                                                                                                                                                                                                 |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| -d or --verbose      | 在终端中打印更详细的信息。 如果将 ``cordova-cli`` 作为模块使用，也可以通过 ``cordova.on('log', function () {})`` 或  ``cordova.on('warn', function () {})``来订阅 ``log`` 和 ``warn`` 事件。                                                         |
| -v or --version      | 输出 ``cordova-cli`` 的版本号.                                                                                                                                                                                                                       |
| --no-update-notifier | 禁用更新检查。 也可以通过在 ``~/.config/configstore/update-notifier-cordova.json`` 中设置 ``"optOut": true`` 或设置环境变量 ``NO_UPDATE_NOTIFIER``(设置任意值均可)(详见[更新通知文档](https://www.npmjs.com/package/update-notifier#user-settings)). |
| --nohooks            | 禁用钩子(参数为正则表达式)                                                                                                                                                                                                                           |
| --no-telemetry       | Disable telemetry collection for the current command.                                                                                                                                                                                                |

## 平台专用选项

适用于特定平台的选项 (``platformOpts``) They can be provided to the cordova-cli with a '--' separator that stops the command parsing within the cordova-lib module and passes through rest of the options for platforms to parse.

## 范例

这个示例演示了如何使用 cordova - cli 创建一个带有 "camera" 插件的项目，并为 "Android" 平台运行它。 特别地，可以提供平台特定选项，如 "- - keystore"：

```bash
# 创建 Cordova 项目。
cordova create myApp com.myCompany.myApp myApp

cd myApp

# 将相机插件添加到项目中，并将相关信息写入 config.xml 和 package.json 。
cordova plugin add cordova-plugin-camera

# 将 Android 平台添加到项目中，并将相关信息写入 config.xml 和 package.json 。
cordova platform add android

# 检查当前系统是否符合构建 Android 平台的代码。
cordova requirements android

# 构建 Android 并打印详细日志。
cordova build android --verbose

# 在 Android 平台上运行这个项目。
cordova run android

# 使用发布模式构建 Android 平台的代码，并通过参数指定签名文件。
cordova build android --release -- --keystore="..\android.keystore" --storePassword=android --alias=mykey
```

## cordova create 命令

### 概要

在指定路径中为 Cordova 项目创建目录结构。

### 语法

```bash
cordova create path [id [name [config]]] [options]
```

| 值     | 说明                                                                                                                                                                                                                                                |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| path   | 应该是一个不存在的目录。 Cordova 将创建这个目录。 有关目录结构的详细信息, 请参阅下文。                                                                                                                                                              |
| id     | _默认值_: ``io.cordova.hellocordova`` <br/>  反向域风格标识符，映射到 ``config.xml`` 中 ``widget`` 元素的 ``id`` 属性。This can be changed but there may be code generated using this value, such as Java package names. 建议您选择适当的值。       |
| name   | _默认值_: ``HelloCordova`` <br/> 应用程序的显示名称，映射到 ``config.xml`` 文件中的 ``name`` 元素。 This can be changed but there may be code generated using this value, such as Java class names. 默认值为 "HelloCordova"，但建议您选择合适的值。 |
| config | JSON 字符串形式的键值对，将被包含到 ``<path>``/.cordova/config.json 文件中                                                                                                                                                                          |

### 选项

| 选项                   | 说明                                                                             |
| ---------------------- | -------------------------------------------------------------------------------- |
| --template             | 使用自定义模板，可以是本地目录、指向 NPM 仓库或 GitHub 。                        |
| --copy-from&#124;--src | _Deprecated_ <br/> Use --template instead. 指定要复制到当前 Cordova 项目的目录。 |
| --link-to              | 不创建副本，仅通过链接到指定的 "www" 目录。                                      |

### 目录结构

Cordova CLI works with the following directory structure:

```
myapp/
|-- config.xml
|-- hooks/
|-- merges/
| | |-- android/
| | |-- windows/
| | |-- ios/
|-- www/
|-- platforms/
| |-- android/
| |-- windows/
| |-- ios/
|-- plugins/
  |--cordova-plugin-camera/
```

#### config.xml

配置应用程序，以支持自定义项目的行为。 参见 [config.xml 参考文档][config.xml ref]

#### www/

包含项目的 web 工件, 如. html、. css 和. js 文件。 作为 cordova 应用程序的开发人员，您的大多数代码和资源都应出现在这里。 它们将通过 ``cordova prepare`` 被复制到每个平台的 www 目录中。 www 源目录在每个平台的子目录中都有一个副本，例如 ``platforms/ios/www`` 或 ``platforms/android/assets/www``。正因如此，您应该只编辑 www 源目录的文件，而不应该编辑位于平台子目录下的 www 目录中的文件。 如果使用版本控制软件，则应将此源 www 文件夹和 merges 文件夹一起添加到版本控制系统中。

#### platforms/

包含添加到项目中的平台的所有源代码和构建脚本。

> **警告:** 当使用 CLI 构建应用程序时，您不应该编辑 / platform / 目录中的任何文件，除非您知道您正在做什么，或者如果文档中另有规定。 当执行 cordova prepare 以便构建应用程序或重新安装插件时, 此目录中的文件通常会被覆盖。

#### plugins/

任何添加的插件将被提取或复制到此目录中。

#### hooks/

此目录可以包含用于自定义 cordova - cli 命令的脚本。 添加到这些目录中的任何脚本都将在对应于目录名的命令之前和之后执行。 这对于集成构建系统或版本控制系统非常有用。

有关详细信息，请参阅 [Hooks Guide]。

#### merges/

特定平台的 web 资源 (如 HTML、CSS 和 JavaScript 文件) ，保存在和平台名对应的子文件夹中。 在 ``prepare`` 阶段，这些资源将被拷贝到相应平台的目录中。  放置在 ``merges/`` 目录中的文件将覆盖相关平台的 "www /" 文件夹中的匹配文件。 下面是一个示例，假定项目结构为：

```
merges/
|-- ios/
| -- app.js
|-- android/
| -- android.js
www/
-- app.js
```

在构建 Android 和 iOS 项目之后，Android 应用程序将同时包含 ``appjs`` 和 ``android. js``。而iOS 应用程序将只包含 ``app. js``，并且该文件将被 ``merges/ios/app.js`` 文件所替代。

#### 关于版本控制

建议不要将 "platform /" 和 "plugins /" 目录签入版本控制，因为它们通常都是通过构建生成的。 平台和插件相关信息都将自动保存在 config.xml 和 package.json 中。 当调用 "cordova prepare" 时，将会自动下载这些平台 / 插件的相关文件。

### 范例

```bash
# 使用指定的 ID 和显示名称在 myapp 目录中创建 Cordova 项目：
cordova create myapp com.mycompany.myteam.myapp MyApp

# 创建一个 Cordova 项目，并以符号链接的方式指定 www 目录。 如果您有一个自定义构建过程或您想在 Cordova 应用程序中使用的现有 web 资源是非常方便的：
cordova create myapp --link-to=../www
```

## cordova platform 命令

### 概要

管理 cordova 平台 - 允许添加、删除、更新、列出和检查更新。 运行添加或删除平台的命令会影响项目平台目录的内容。

### 语法

```bash
cordova {platform | platforms} [
    add <platform-spec> [...] {--save | link=<path> } |
    {remove | rm}  platform [...] {--save}|
    {list | ls}  |
    check |
    save |
    update ]
```

| 子命令                        | 选项              | 说明                                                                                                                                                                       |
| ----------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| add ``<platform-spec>`` [...] |                   | 添加指定的平台                                                                                                                                                             |
|                               | --nosave          | Do not save ``<platform-spec>`` into ``config.xml`` & ``package.json`` after installing them using ``<engine>`` tag                                                        |
|                               | --link=``<path>`` | When ``<platform-spec>`` is a local path, links the platform library directly instead of making a copy of it (support varies by platform; useful for platform development) |
| remove ``<platform>`` [...]   |                   | 移除指定的平台                                                                                                                                                             |
|                               | --nosave          | 删除指定平台目录，但保留 ``config.xml`` 和 ``package.json`` 中的相关信息                                                                                                   |
| update ``platform`` [...]     |                   | 更新指定平台                                                                                                                                                               |
|                               | --save            | 更新 ``config.xml`` 中的相关版本号                                                                                                                                         |
| list                          |                   | 列出所有已安装和可用的平台                                                                                                                                                 |
| check                         |                   | 列出可通过 ``cordova-cli platform update`` 更新的平台                                                                                                                      |
| save                          |                   | Save ``<platform-spec>`` of all platforms added to config.xml                                                                                                              |

### Platform-spec

有许多方法来指定一个平台：

```bash
<platform-spec> : platform[@version] | path | url[#commit-ish]
```

| 值         | 说明                                                                                                                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| platform   | 需添加到项目中的平台名称，如 Android、iOS、windows 等。 Every release of cordova CLI pins a version for each platform. When no version is specified this version is used to add the platform. |
| version    | 主要版本号.次要版本号.补丁版本号 风格的版本号                                                                                                                                                 |
| path       | 包含平台的目录或 tar 包的路径                                                                                                                                                                 |
| url        | 包含平台的指向 git 仓库或 tar 包的 URL                                                                                                                                                        |
| commit-ish | 提交、标签或分支引用. 如果未指定，则使用 ``master``                                                                                                                                           |

### 支持的平台

- Android
- iOS
- Windows (8.1, Phone 8.1, UWP - Windows 10)
- Blackberry10
- Ubuntu
- Browser

### 废弃的平台

- Amazon-fireos (使用 Android 来代替)
- WP8 (使用 Windows 来代替)
- Windows 8.0 (用于旧版的 cordova)
- Firefox OS (用于旧版的 cordova)

### 范例

```bash
# 添加 android 和  ios 平台，并将相关信息（包括版本号）保存到 config.xml 和 package.json 中:
cordova platform add android ios

# 添加 android 平台，指定[语义化版本号](http://semver.org/) 为 ^5.0.0，并将相关信息保存到 config.xml 和 package.json 中:
cordova platform add android@^5.0.0

# 通过克隆指定的 git 仓库及标签来添加平台：
cordova platform add https://github.com/myfork/cordova-android.git#4.0.0

# 使用名为 Android 的本地目录来添加平台:
cordova platform add ../android

# 使用指定的 tar 包来添加平台:
cordova platform add ../cordova-android.tgz

# 从项目中删除 Android 平台，并从 config.xml 和 package.json 中删除相关信息：
cordova platform rm android

# 从项目中删除 Android 平台，但保留 config.xml 和 package.json 中的相关信息：
cordova platform rm android --nosave

# 列出已安装的和可用的平台及其版本号。 这在报告问题时查看版本号很有用：
cordova platform ls

# 将当前添加到项目中的所有平台的版本保存到 config.xml 和 package.json 中：
cordova platform save
```

## cordova plugin 命令

### 概要

管理项目中的插件

### 语法

```bash
cordova {plugin | plugins} [
    add <plugin-spec> [..] {--searchpath=<directory> | --noregistry | --link | --save | --browserify | --force} |
    {remove | rm} {<pluginid> | <name>} --save |
    {list | ls} |
    search [<keyword>] |
    save |
]
```

| 子命令                             | 选项                         | 说明                                                                                                                                                        |
| ---------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| add ``<plugin-spec>`` [...]        |                              | 添加指定的插件。                                                                                                                                            |
|                                    | --searchpath ``<directory>`` | 当按 ID 查找插件时，在查询注册表之前，先查看这个目录及其每个子目录。 可以指定多条搜索路径。 多个路径的分割符，类 Linux 系统使用 ``:``， Windows使用 ``;``。 |
|                                    | --noregistry                 | 不要在注册表中搜索插件。                                                                                                                                    |
|                                    | --link                       | 当使用本地路径安装插件时，以创建链接来代替复制文件. 文件链接的创建因平台而异。 这非常便于插件开发。                                                         |
|                                    | --nosave                     | 不将插件相关信息保存到 ``config.xml`` (plugin 元素)或 ``package.json`` 中                                                                                   |
|                                    | --browserify                 | Compile plugin JS at build time using browserify instead of runtime.                                                                                        |
|                                    | --force                      | _Introduced in version 6.1._ Forces copying source files from the plugin even if the same file already exists in the target directory.                      |
| remove ``<pluginid>|<name>`` [...] |                              | 移除具有给定 ID / 名称的插件。                                                                                                                              |
|                                    | --nosave                     | 不删除 config.xml 和 package.json 中的插件相关信息。                                                                                                        |
| list                               |                              | 列出当前已安装的插件(包括其版本信息)                                                                                                                        |
| search `[<keyword>]` [...]         |                              | 在 http://plugins.cordova.io 中搜索符合搜索关键字的插件                                                                                                     |
| save                               |                              | 将所有已添加的插件的相关信息保存到项目配置中。                                                                                                              |

### Plugin-spec

有许多方法来指定插件：

    <plugin-spec> : [@scope/]pluginID[@version]|directory|url[#commit-ish][:subdir]

| 值         | 说明                                                                |
| ---------- | ------------------------------------------------------------------- |
| scope      | Scope of plugin published as a [scoped npm package]                 |
| plugin     | Plugin id (id of plugin in npm registry or in --searchPath)         |
| version    | Major.minor.patch version specifier using semver                    |
| directory  | Directory containing plugin.xml                                     |
| url        | Url to a git repository containing a plugin.xml                     |
| commit-ish | Commit/tag/branch reference. If none is specified, 'master' is used |

### 插件解析算法

当向项目添加插件时，CLI 将解析该插件。
解析将按以下优先顺序使用 ``plugin-spec``：

1. 在命令中给出 ``plugin-spec`` (例如：``cordova plugin add pluginID@version``)
2. ``plugin-spec`` 保存在 ``config.xml`` 和 ``package.json`` 中 (例如：插件已被添加过，并且没有使用 ``--nosave`` 参数)
3. 从 Cordova 6. 1 版开始，当前项目所支持的，已发布到 npm 仓库的最新版本（仅适用于在 "package.json" 中列出其 "Cordova 依赖项" 的插件）
4. 发布到 npm 的最新插件版本。

### 范例

```bash
# 在项目中添加 cordova-plugin-camera 和 cordova-plugin-file 插件，并将相关信息保存到 config.xml 和 package.json 中。 使用 ../plugins 目录搜索插件。
cordova plugin add cordova-plugin-camera cordova-plugin-file --save --searchpath ../plugins

# 在项目中添加 cordova-plugin-camera 插件，指定版本号为 ^2.0.0，并将相关信息保存到 config.xml 和 package.json 中:
cordova plugin add cordova-plugin-camera@^2.0.0

# 从指定的本地目录添加插件:
cordova plugin add ../cordova-plugin-camera

# 从指定的 tar 包文件添加插件:
cordova plugin add ../cordova-plugin-camera.tgz

# 从项目中移除指定插件，并将相关信息从 config.xml 和 package.json 中删除:
cordova plugin rm camera

# 从项目中移除指定插件，但保留 config.xml 和 package.json 中的相关信息:
cordova plugin rm camera --nosave

# 列出项目中安装的所有插件:
cordova plugin ls
```

### 插件冲突
当在 plugin.xml 文件中添加使用 ``edit-config`` 标记的插件时，可能会出现冲突的插件。 ``edit-config`` 允许插件添加或替换 XML 元素的属性。

如果不止一个插件试图修改同一个 XML 元素，这就会引起应用程序的问题。 冲突检测可以防止在添加插件时，不会试图覆盖另一个插件的 "edit-config" 更改。 当 "edit-config" 中发现冲突时，插件将无法添加，并抛出错误。 错误消息将提示必须在添加插件之前解决所有冲突。 解决 "edit - config" 冲突的一个方法是更改受影响插件的 plugin.xml，使它们不再修改相同的 XML 元素。 另一个方法是使用 ``--force`` 参数强制添加插件。 应该谨慎使用此方法，因为它将忽略冲突检测，并覆盖冲突，因此可能使其他插件处于不良状态。

请参阅 [plugin.xml 指南](https://cordova.apache.org/docs/en/latest/plugin_ref/spec.html#edit-config) 查看 ``edit-config`` 管理, 冲突解决和相关范例.

## cordova prepare 命令

### 概要

将 config.xml 元数据转换为指定平台的清单文件，并拷贝图标及闪屏，
复制相关平台的插件文件，以便项目可以进行本地构建。

### 语法

```
cordova prepare [<platform> [..]]
     [--browserify]
```

### 选项

| 选项                | 说明                                                                 |
| ------------------- | -------------------------------------------------------------------- |
| ``<platform> [..]`` | 需要执行 prepare 的平台，可以指定多个。 如果未指定，则生成所有平台。 |
| --browserify        | Compile plugin JS at build time using browserify instead of runtime. |

## cordova compile 命令

### 概要

``cordova compile`` 是 [cordova build 命令](#cordova-build-command) 的子集。
它只执行编译步骤而不做 prepare 操作。 实际开发中，通常使用 ``cordova build`` 命令来代替这个命令 - 然而，这个阶段对于 [hooks] 扩展很有帮助。

### 语法

```bash
cordova build [<platform> [...]]
    [--debug|--release]
    [--device|--emulator|--target=<targetName>]
    [--buildConfig=<configfile>]
    [--browserify]
    [-- <platformOpts>]
```
有关详细文档，请参见下面的 [cordova build 命令](#cordova-build-command)。

## cordova build 命令

### 概要

是 ``cordova prepare`` + ``cordova compile`` 的快捷方式。 用于为指定的平台构建应用程序。

### 语法

```bash
cordova build [<platform> [...]]
    [--debug|--release]
    [--device|--emulator]
    [--buildConfig=<configfile>]
    [--browserify]
    [-- <platformOpts>]
```

| 选项                           | 说明                                                                                                                                                                             |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ``<platform> [..]``            | 待构建的平台，可以指定多个。 如果未指定，则生成所有平台。                                                                                                                        |
| --debug                        | 生成调试版 通常这会在相应平台中开启编译的调试模式。                                                                                                                              |
| --release                      | 构建为发布版。 通常这会在相应平台中开启编译的发布模式。                                                                                                                          |
| --device                       | 为真实设备构建                                                                                                                                                                   |
| --emulator                     | 为仿真器构建 特别的, 真实设备和仿真器的平台结构可能不同。                                                                                                                        |
| --buildConfig=``<configFile>`` | 默认值: build.json(相应平台目录的 cordova 目录中，需要自行创建) . <br/> 指定用于构建的配置文件。 ``build.json`` 文件用于指定应用程序构建过程所需的参数，比如与包签名相关的参数。 |
| --browserify                   | Compile plugin JS at build time using browserify instead of runtime                                                                                                              |
| ``<platformOpts>``             | 设置特定于平台的选项，必须在 ``--`` 分隔符之后指定。 有关详细信息，请查看平台指南。                                                                                              |

### 范例

```bash
# 在 调试 模式下为 android 和 windows 平台进行可以部署到设备上的构建：
cordova build android windows --debug --device

# 在 发布 模式下为 Android 平台构建，并使用指定的构建配置：
cordova build android --release --buildConfig=..\myBuildConfig.json

# 在发布模式下为 Android 平台构建，并配置自定义的平台选项：
cordova build android --release -- --keystore="..\android.keystore" --storePassword=android --alias=mykey
```

## cordova run 命令

### 概要

准备、构建、并将生成的应用部署到指定设备或仿真器上。 如果连接了设备，则将使用该设备，除非已运行了符合条件的仿真器。

### 语法

```bash
cordova run [<platform> [...]]
    [--list | --debug | --release]
    [--noprepare] [--nobuild]
    [--device|--emulator|--target=<targetName>]
    [--buildConfig=<configfile>]
    [--browserify]
    [-- <platformOpts>]
```

| 选项                           | 说明                                                                                                                                                                             |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ``<platform> [..]``            | 指定需要运行的平台，可以指定多个。. 如果未指定，则在所有平台上运行。                                                                                                             |
| --list                         | 列出所有可供运行的目标。 如果没有指定，真实设备和仿真器都会列出。                                                                                                                |
| --debug                        | 部署调试版本。 除非指定 ``--release``，否则这是默认行为。                                                                                                                        |
| --release                      | 部署发布版。                                                                                                                                                                     |
| --noprepare                    | 跳过准备操作 (仅在 Cordova v6. 2 或更高版本中支持)                                                                                                                               |
| --nobuild                      | 跳过构建。                                                                                                                                                                       |
| --device                       | 部署到设备。                                                                                                                                                                     |
| --emulator                     | 部署到仿真器。                                                                                                                                                                   |
| --target                       | 指定部署到特定的仿真器或设备。 可以使用 ``--list`` 列出所有可用的目标设备。                                                                                                      |
| --buildConfig=``<configFile>`` | 默认值: build.json(相应平台目录的 cordova 目录中，需要自行创建) 。 <br/>指定用于构建的配置文件。 ``build.json`` 文件用于指定应用程序构建过程所需的参数，比如与包签名相关的参数。 |
| --browserify                   | Compile plugin JS at build time using browserify instead of runtime                                                                                                              |
| ``<platformOpts>``             | 设置特定于平台的选项，必须在 ``--`` 分隔符之后指定。 有关详细信息，请查看平台指南。                                                                                              |

### 范例

```bash
# 构建 android 平台的发布版本，在名称为 Nexus_5_API_23_x86 的仿真器上运行。并指定了自定义的构建配置:
cordova run android --release --buildConfig=..\myBuildConfig.json --target=Nexus_5_API_23_x86

# 跳过构建，在真是设备或的仿真器上运行（如果真实设备没有连接）。
cordova run android --nobuild

# 在 ios 设备上运行当前 cordova 项目的调试构建：
cordova run ios --device

# 列出可用于运行此应用程序的所有连接设备和可用模拟器的名称：
cordova run ios --list
```

## cordova emulate 命令

### 概要

是 ``cordova run --emulator`` 命令的别称. 启动模拟器而不是设备。
有关详细信息，请参阅 [cordova run 命令文档](#cordova-run-command)

## cordova clean 命令

### 概要

通过运行特定于平台的构建清理来清理指定平台或所有平台的构建。

### 语法

```bash
cordova clean [<platform> [...]]
```

### 范例

```bash
# 清理 Android 平台的构建：
cordova clean android
```

## cordova requirements 命令

### 概要

检查并打印出指定平台或所有已添加平台（如果未指定）的用于编译的环境需求。
 如果满足每个平台的所有要求，命令将以代码 0 退出。
否则将以其他非零值退出。

这在自动构建工具集成时非常有用。

### 语法

```
cordova requirements android
```

## cordova info 命令

### 概要

打印出有助于提交 bug 和获取帮助的信息。
  将会在项目根目录创建 info.txt 文件。
base of your project.

### 语法

```
cordova info
```

## cordova serve 命令

### 概要

使用指定的端口或默认值(8000)来启动本地 web 服务器。 可通过以下地址访问项目： ``http://HOST_IP:PORT/PLATFORM/www``

### 语法

```
cordova serve [port]
```

## cordova telemetry 命令

### 概要

打开或关闭开发者数据采集功能。

主要收集以下数据：

* 开发者 IP 地址
* 开发者操作系统类型及版本
* 开发者使用的 Node 版本
* 开发者使用的 Cordova 版本
* 开发者执行的命令、时间和状态(成功/失败)

在[这里](https://datastudio.google.com/org//reporting/0B-Ja5cNOX_XLTElHdWd4V2NUem8/page/xEE)可以看到官方数据统计。


### 语法

```
cordova telemetry [STATE]
```

| 选项 | 说明                     |
| ---- | ------------------------ |
| on   | 开启开发者数据采集系统。 |
| off  | 关闭开发者数据采集系统。 |

### 详述
 第一次运行 cordova 命令时，将显示一个定时提示，要求用户选择进入或退出。
 它将等待 30 秒，之后如果用户不提供任何答案，则将自动选择退出。
 在 CI 环境中，可以通过设置 "CI" 环境变量来将防止提示出现。
 也可以使用 "--no-telemetry" 标志在单个命令上关闭用户数据采集系统。

### 范例

```bash
cordova telemetry on
cordova telemetry off
cordova build --no-telemetry
```

有关详细信息，请参阅我们的隐私通知：https://cordova.apache.org/privacy

## cordova help 命令

### 概要

显示语法摘要或特定命令的帮助。

### 语法

```
cordova help [command]
cordova [command] -h
cordova -h [command]
```

## cordova config 命令

### 概要

设置、获取、删除、编辑和列出全局 cordova 选项。

### 语法

```
cordova config ls
cordova config edit
cordova config set <key> <value>
cordova config get <key>
cordova config delete <key>
```
### 范例

```bash
cordova config set autosave false
cordova config set browserify false
```

[Hooks Guide]: ../../guide/appdev/hooks/index.en.md
[config.xml ref]: ../../config_ref/index.md
[scoped npm package]: https://docs.npmjs.com/misc/scope
