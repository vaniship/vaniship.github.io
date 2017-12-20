# Selenium grid for RC and WebDriver

英文原文见：[Selenium grid for RC and WebDriver](https://github.com/SeleniumHQ/selenium/wiki/Grid2)

## 介绍

Grid 可以完成以下工作:

* 将测试分配给多台机器（并行执行）
使用一个中心节点管理多个环境，以便支持执行复杂的组合测试。
* 可通过自定义钩子来支持虚拟化基础架构，以最大限度地减少维护时间。

## 快速开始

以下例子将展示如何启动一个 Selenium 2 管理节点，并注册一个WebDriver节点和 一个 Selenium 1 RC 遗留节点。还将您展示如何使用 Java 调用 Grid 。该案例中管理节点和工作节点在同一台机器上运行，也可以将 selenium-server-standalone 复制到多台不同的机器上。

> 注：selenium-server-standalone 软件包包括管理节点，WebDriver的，和旧的RC。Ant 不是必须的。
> 可以在 http://selenium-release.storage.googleapis.com/index.html 下载 selenium-server-standalone-*.jar

以下假定已经安装了Java。

### 第1步：启动管理节点

管理节点负责接收所有的测试请求，并将请求分发到正确的节点上。

打开命令提示符，然后切换到 selenium-server-standalone 所在的目录。键入以下命令：

``` bash
java -jar selenium-server-standalone-<version>.jar -role hub
```

管理节点将启动，并默认使用端口4444。如果需要更改默认端口，可在运行命令添加可选参数 -port 。

可以通过打开浏览器窗口并输入下面的地址查看管理节点的状态：
http://localhost:4444/grid/console

### 第2步：启动工作节点

无论是使用新的 WebDriver ,还是旧的 Selenium 1 RC , 或者同时使用, 都可以使用和启动管理节点一样的 selenium-server-standalone jar 文件来启动工作节点。

``` bash
java -jar selenium-server-standalone-<version>.jar -role node -hub http://localhost:4444/grid/register
```

> 注：只要提供了“-role”选项，并且该选项值不是 hub ，默认端口将为5555。

同时使用RC和webdriver节点时，虽然连接是向下兼容“WD”和“RC”的，但是在节点使用远程API时还是有相应的限制。

## 使用 grid 运行测试案例

（以 Java 为例）
现在Grid已经配置完毕，我们需要通过Grid运行测试用例。对于 Selenium 1 RC 节点，可以继续使用 DefaultSelenium 对象传递管理节点信息:

``` java
Selenium selenium = new DefaultSelenium(“localhost”, 4444, “*firefox”, “http://www.google.com”);
```

对于WebDriver节点，需要使用 RemoteWebDriver 和 DesiredCapabilities 对象来定义希望使用的浏览器，版本和平台。

创建运行测试的目标浏览器应具备的特性描述对象：

``` java
DesiredCapabilities capability = DesiredCapabilities.firefox();
```

使用描述对象构造 RemoteWebDriver 对象：

``` java
WebDriver driver = new RemoteWebDriver(new URL("http://localhost:4444/wd/hub"), capability);
```

管理节点将分配测试到一个匹配的节点上。

匹配的节点是指满足了所有请求功能的节点。可使用webdriver对象指定更多的特定功能需求。如：

``` java
capability.setBrowserName();
capability.setPlatform();
capability.setVersion()
capability.setCapability(,);
```

举例：设置节点：

``` bash
 -browser  browserName=firefox,version=3.6,platform=LINUX
```

将匹配以下情况：

``` java
capability.setBrowserName(“firefox” );
capability.setPlatform(“LINUX”);
capability.setVersion(“3.6”);
```

并且也将匹配：

``` java
capability.setBrowserName(“firefox” );
capability.setVersion(“3.6”);
```

未指定的功能特性将被忽略。

如果指定了不在Grid中存在的功能描述（例如，测试指定 Firefox 4.0 版，但没有火狐 4 的实例），那么就会出现不匹配，测试将无法运行。

## 配置节点

节点有2种不同的配置方式:

* 通过指定命令行参数
* 通过指定一个JSON文件

### 通过配置命令行中的节点

默认情况下，启动节点允许同时使用 11 种浏览器：5个 Firefox, 5个 Chrome, 1个 Internet Explorer 。同时进行测试的最大数量默认设置为 5 。

要改变类似这些浏览器设置，可以在参数 -browser 上设置选项。如果使用-browser参数，默认的浏览器将被忽略，只有指的浏览器会被使用（每条 -browser 参数对应一类节点）。

``` java
-browser browserName=firefox,version=3.6,maxInstances=5,platform=LINUX
```

以上设置为：在一台Linux机器上的启动 5 个 Firefox 3.6 的节点。

如果想使用远程计算机上的多个版本的Firefox，可以指定每个二进制文件的路径：

``` java
-browser browserName=firefox,version=3.6,firefox_binary=/home/myhomedir/firefox36/firefox,maxInstances=3,platform=LINUX

-browser browserName=firefox,version=4,firefox_binary=/home/myhomedir/firefox4/firefox,maxInstances=4,platform=LINUX
```

提示：如果参数中带有空格，参数需要使用引号括起来，例如：

``` java
-browser “browserName=firefox,version=3.6,firefox_binary=c:\Program Files\firefox ,maxInstances=3, platform=WINDOWS”
```

#### 可选参数

* -port 4444 （4444为默认）
* -host <IP | hostname> 指定主机名或IP地址。通常不需要指定。如有特殊的网络配置，如 VPN 网络，指定主机可能是必要的。
* -timeout 30 （300默认值）以秒为单位的超时时间，如果管理节点未收到任何请求超过指定的秒数，将自动释放该节点，并可执行队列中的另一个测试。这有助于清除客户端崩溃，无需人工干预。如果要完全清除超时，可指定 -timeout 0 ，管理节点将永远不会释放节点。

  > 注：该超时不是指“等待WebElement”的命令超时。

* -maxSession 5 默认值是 5 ，可以在该节点上并行运行的浏览器的最大数量。这与支持的最大浏览器实例数不同（例如：对于支持Firefox 3.6，火狐4.0和Internet Explorer 8中的一个节点，maxSession = 1 将确保不会有超过1浏览器中运行。当 maxSession = 2 ，将可以在同一时间执行 2 个 Firefox 测试，或者 1 个 Internet Explorer 和 1个 Firefox测试）。
* -browser <params> 如果没有设置 -browser，节点将使用 5 个 firefox, 1  个 chrome 和 1 个 internet explorer 实例（假设在Windows中）。该参数可以在同一行中设置多次，代表定义多个类型的浏览器。

  以下是 -browser 可以指定的参数：

  ``` bash
  browserName={android, chrome, firefox, htmlunit, internet explorer, iphone, opera}
  version={browser version}
  firefox_binary={可执行文件的路径}
  chrome_binary = {可执行文件的路径}
  MAXINSTANCES = {这种类型的浏览器的最大数量}
  platform={WINDOWS, LINUX, MAC}
  ```

* -registerCycle 工作几点重新注册时间，单位为毫秒。该配置用于支持管理节点重启时，工作节点自动重新注册，无需重启。

* -DPOOL_MAX 大型管理节点(>50工作节点) 可能需要用下面的配置增大 jetty 线程池 -DPOOL_MAX=512 (或更大) 。

#### 超时配置（版本2.21以上）

在 selenium grid 上的超时一般取决于 webDriver.manage().timeouts() , 超过该时间将触发超时处理机制。

为了保证 selenium grid 运行时的完整性，还有可以配置另外两个超时值。

* -timeout 命令行选项设置为“30”秒将确保所有的资源都能在客户端崩溃30秒后得到收回
* -browserTimeout 60 使节点上的浏览器最长阻塞60秒。这将确保所有的资源都在60秒后回收。如果管理节点设置了这两个参数，所有工作节点都会从管理节点获取这两个设置。

  > 注：本地工作节点上的该参设置数具有优先权，一般不建议在工作节点上设置这些超时。

  browserTimeout 一般满足：

  * 比 socket lock timeout 长 (45 seconds)
  * 通常比 webDriver.manage().timeouts() 长, 因为这种超时机制是“最后一道防线”

### 使用JSON配置工作节点

``` bash
java -jar selenium-server-standalone.jar -role node -nodeConfig nodeconfig.json
```

例子中服务器3.x.x版（> = BETA4）的 nodeconfig 文件请见：
https://github.com/SeleniumHQ/selenium/blob/master/java/server/src/org/openqa/grid/common/defaults/DefaultNodeWebDriver.json

例子中服务器2.x.x版的 nodeconfig 文件请见：
https://github.com/SeleniumHQ/selenium/blob/selenium-2.53.0/java/server/src/org/openqa/grid/common/defaults/DefaultNode.json

> 注：在2.x.x版本的配置对象已在3.x.x版已扁平化（> = BETA4）

#### 使用JSON配置管理节点

``` bash
java -jar selenium-server-standalone.jar -role hub -hubConfig hubconfig.json
```

例子中的hubconfig.json文件请见：
https://github.com/SeleniumHQ/selenium/blob/master/java/server/src/org/openqa/grid/common/defaults/DefaultHub.json

#### 管理节点的诊断信息

如果使用了错误的配置参数，管理节点可能给出以下错误信息:

Client requested session XYZ that was terminated due to REASON

| 错误 | 原因/修复 |
|---|----|
|TIMEOUT|会话超时，客户端没有在超时时间内响应。这可能发生在客户端被某种方式挂起或阻塞时出现。|
|BROWSER_TIMEOUT|浏览器超时，当浏览器阻塞太久时出现（超时时间可通过参数 browserTimeout 配置）|
|ORPHAN|A client waiting in queue has given up once it was offered a new session|
|CLIENT_STOPPED_SESSION|客户端通过正常的调用结束了会话。再次使用已停止的会话时就会出现该错误。|
|CLIENT_GONE|客户端进程（你的代码）死机或长时间没有响应，也可能是间歇性的网络问题引起的。|
|FORWARDING_TO_NODE_FAILED|管理节点无法将命令转发到指定工作节点。可能是内存不足的错误、节点的稳定性问题或网络问题。|
|CREATIONFAILED|工作节点未能创建浏览器。一般是因为工作该节点上的环境或配置有问题。可以尝试直接在工作节点上跟踪问题。|
|PROXY_REREGISTRATION|会话已被丢弃，因为该节点已重新注册到 Grid 上（在测试中）|

## 使用 Grid 的技巧

如果要进行并行测试，请确保每个线程独立于其他测试线程释放 webdriver 资源。每线程启动一个浏览器，并在结束时释放所有浏览器并不是一个好主意。（如果有一个测试用例因为异常消耗了大量的时间，其他测试用例将很可能也会出现超时，因为他们正在等待缓慢的测试用例，这通常会令人非常困惑。）


