# WebDriver Wire 协议

英文原文见：[JsonWireProtocol](https://github.com/SeleniumHQ/selenium/wiki/JsonWireProtocol)

> 状态: OBSOLETE 见 [W3C WebDriver 规范](https://w3c.github.io/webdriver/webdriver-spec.html)

## 引言

WebDriver 是一个和浏览器或 RemoteWebDriver 服务器通讯的接口，所有该接口的实现都使用一个公共的通信协议。该协议定义了一个在 HTTP 上的 JSON RESTful Web Service 。

该协议假设 WebDriver 的 API 已经被“扁平化”，但客户端实现采取更多面向对象的方法，就像现有的 Java API 。协议中的“命令”和“响应”的对应请求/响应。

## 基本术语和概念

### 客户端

使用 WebDriver API 的设备。

### 服务器

运行 RemoteWebDriver 的设备。也指浏览器对该协议的实现，如 FirefoxDriver 或 IPhoneDriver。

### 会话

服务器保持每个浏览器对应一个会话。发送到会话命令将被路由到相应的浏览器上。

### WebElement

WebDriver API 中的一个对象相当于页面上的一个 DOM 元素。

### WebElement JSON 对象

传输使用 JSON 表示 WebElement 。该对象将具有以下属性：

|Key|类型|描述|
|---|---|---|
|ELEMENT|string|元素的ID由服务器自动分配。这个 ID 用于对该元素发出的所有后续命令。|

### Capabilities JSON 对象

不是所有的服务器都实现了WebDriver支持的全部功能。因此，客户端和服务器应使用JSON对象描述其支持的特性，支持下面列出的属性。

|Key|类型|描述|
|---|---|---|
|browserName|string|浏览器名称;应该是以下其中之一 {chrome|firefox|htmlunit|internet explorer|iphone}|
|version|string|浏览器版本，如果不明 ，可以为空字符串。|
|platform|string|运行平台。应该是以下其中之一 {WINDOWS|XP|VISTA|MAC|LINUX|UNIX} 可以指定ANY表示可用任何平台。|
|javascriptEnabled|boolean|当前会话是否支持执行用户在当前页面上下文执行JavaScript。|
|takesScreenshot|boolean|当前会话是否支持当前页面截图。|
|handlesAlerts|boolean|当前会话是否支持与模态弹出框互动，如 window.alert 和 window.confirm 。|
|databaseEnabled|boolean|当前会话是否支持操作数据库存储。|
|locationContextEnabled|boolean|当前会话是否可以设置和查询浏览器的地址位置。|
|applicationCacheEnabled|boolean|当前会话是否可以与应用程序的高速缓存交互。|
|browserConnectionEnabled|boolean|当前会话是否可以查询浏览器的连接并禁用它。|
|cssSelectorsEnabled|boolean|当前会话是否支持用CSS选择器搜索元素。|
|webStorageEnabled|boolean|当前会话是否会支持与操作 storage objects 。|
|rotatable|boolean|当前会话是否支持旋转当前页面（仅适用于移动平台）。|
|acceptSslCerts|boolean|当前会话是否默认接受所有SSL证书。|
|nativeEvents|boolean|当前会话是否能够模拟用户输入的本地事件。|
|proxy|proxy object|代理的详细配置。如果未指定，则使用该系统当前代理或默认状态。具体格式在 Proxy JSON 对象中指定。|

### Desired Capabilities （期望能力）

Capabilities JSON 对象由客户端发出，用于描述待创建的新的会话应具备的功能。任何没有被明确指明的功能都被认为是无关紧要的。更多信息详见 DesiredCapabilities 。

### Actual Capabilities （实际能力）

Capabilities JSON 对象是服务器端返回的，用来描述服务器所支持的功能。没有返回的功能均表示该会话不支持相应的能力。

### Cookie JSON 对象

描述 Cookie 的 JSON对象。

|Key|类型|描述|
|---|---|---|
|name|string|cookie的名称。|
|value|string|cookie的值。|
|path|string|（可选）Cookie的路径。|
|domain|string|（可选）Cookie的域。|
|secure|boolean|（可选）是否是安全cookie。|
|httpOnly|boolean|（可选）Cookie是否是HttpOnly Cookie。|
|expiry|number|（可选）Cookie到期时间，UTC 1970年1月1日零时起，以秒为单位。|

如果返回Cookie对象，应移除服务器不能提供的可省略字段。

### Log Entry JSON 对象

描述日志条目的 JSON 对象。

|Key|类型|描述|
|---|---|---|
|timestamp|number|条目的时间戳。|
|level|string|条目的日志级别，例如，“信息”（见日志级别 ）。|
|message|string|日志消息。|

### 日志级别

日志级别，从上至下日志信息越来越粗略。

|等級|描述|
|---|---|
|ALL|所有日志消息。打印通信日志和配置日志。|
|DEBUG|调试信息。|
|INFO|一般信息。|
|WARNING|非关键问题的消息。|
|SEVERE|严重错误的消息。|
|OFF|不打印日志消息。|

### 日志类型

下表列出了常见的日志类型。其他日志类型如性能记录也可以支持。

|日志类型|描述|
|---|---|
|client|客户端输出的日志。|
|driver|WebDriver输出的日志。|
|browser|浏览器输出的日志。|
|server|服务器输出的日志。|

### Proxy JSON 对象

描述代理配置的JSON对象。

|Key|类型|描述|
|---|---|---|
|proxyType|string|（必需）代理类型。可能的值为: <li> direct - 直接连接 - 无代理 <li> manual - 手动配置代理, 如设置HTTP 或 FTP 等 <li> pac - 通过 URL 自动配置代理 <li> autodetect - 自动检测, 可能为 WPAD <li> system - 使用系统设置|
|proxyAutoconfigUrl|string|（代理 如果 proxyType == pac， 否则将被忽略）指定用于代理自动配置的URL。一般格式为： http://hostname.com:1234/pacfile|
|ftpProxy, httpProxy, sslProxy, socksProxy|string|（可选，如果 proxyType!= manual 则忽略该配置）指定用于FTP，HTTP，HTTPS和SOCKS的代理。如果 proxyType==manual ，且请求时未指定协议，代理行为将是不确定的。一般格式为：hostname.com:1234|
|socksUsername|string|（可选，如果 proxyType!= manual并且未设置socksProxy 则忽略该配置）指定SOCKS代理的用户名。
|socksPassword|string|（可选，如果 proxyType!= manual 并且未设置 socksProxy 则忽略该配置）指定SOCKS代理的密码。
|noProxy|string|（可选，如果proxyType!= manual  则忽略该配置）设置跳过代理。Format is driver specific. 

## 消息

### 命令集

WebDriver命令消息应符合 HTTP / 1.1 规范 。尽管服务器可扩展为响应各种内容类型，但 JSON Wire 协议约定所有命令接受的 Content-Type 应为 application/json;charset=UTF-8 。同样，POST 或 PUT 请求的消息体必须使用 application/json;charset=UTF-8 作为 Content-Type。

WebDriver 服务的每个命令都应映射到一个 HTTP 路径的特定方法上。用冒号（:)做前缀的路径段表示该段是一个变量。例如，资源映射为：

    GET /favorite/color/:name

该映射表示，服务器响应GET请求，如果请求路径为 "/favorite/color/Jack" 和 "/favorite/color/Jill" 的请求，变量 name 分别为“Jack”和“Jill”。

### 响应

命令响应应为 HTTP / 1.1 响应消息 。如果远程服务器返回4xx响应，响应的 Content-Type 应为 text/plain ，消息体应为错误请求的描述信息。对于其他情况，如果响应包括消息体， 它的 Content-Type 必须为 application/json;charset=UTF-8 ，消息体的JSON对象将具有以下属性：

|Key|类型|描述|
|---|---|---|
|sessionId|string	|会话ID|
|status|number	命令结果的状态代码。非零值表示失败。|
|value|*|响应JSON值。|

### 响应状态码

JSON Wire 协议从 InternetExplorerDriver 继承了状态代码：

|源代码|摘要|说明|
|---|---|---|
|0|Success|该命令执行成功。|
|6|NoSuchDriver|会话终止或未启动|
|7|NoSuchElement|无法用给定的搜索参数在页面上定位元素。|
|8|NoSuchFrame	|无法切换到指定的 frame，因为该 frame 找不到。|
|9|UnknownCommand	|找不到请求的资源，或使用了该资源不支持的 HTTP 方法。|
|10|StaleElementReference|元素操作命令无法完成，因为引用的元素已经不在 DOM 上了。|
|11|ElementNotVisible|元素操作命令无法完成，因为该元素在页面上不可见。|
|12|InvalidElementState|元素命令无法完成，因为该元素处于无效状态，如试图单击已禁用的元素。|
|13|UnknownError|执行命令时，出现了未知的服务器端错误。|
|15|ElementIsNotSelectable|试图选择不能被选中的元素。|
|17|JavaScriptError|执行用户 JavaScript 时发生错误。|
|19|XPathLookupError|使用 XPath 定位元素时发生错误。|
|21|Timeout|操作没有在超时时间内完成。|
|23|NoSuchWindow|无法切换到指定窗口，因为无法找到该窗口。|
|24|InvalidCookieDomain|试图操作与当前页面不同域的 Cookie。|
|25|UnableToSetCookie|无法成功设置指定的 Cookie 值。|
|26|UnexpectedAlertOpen|操作无法完成，因为打开的模态对话框阻止了该操作。|
|27|NoAlertOpenError|试图操作一个未打开的模态对话框。|
|28|ScriptTimeout|	脚本没有在超时时间内完成执行。|
|29|InvalidElementCoordinates|提供给交互操作的坐标是无效的。|
|30|IMENotAvailable|IME不可用。|
|31|IMEEngineActivationFailed|IME无法启动。|
|32|InvalidSelector|使用了无效的选择器（如 XPath / CSS 选择器）。|
|33|SessionNotCreatedException|无法建立新的会话。|
|34|MoveTargetOutOfBounds|指定的移动动作超出了边界。|

服务器端的 "Unknown command" 错误应解释为 "404 Not Found" 响应。其他 4xx 和 5xx 错误没有特定的错误码，统一被解释为“未知错误”响应。

### 错误处理

JSON Wire 协议规定的错误处理有两个层次：无效的请求和失败的命令。

#### 无效请求

所有无效请求应导致服务器返回 4XX HTTP 响应。响应 Content-Type 应设为 text/plain ，消息体应该是一个描述性错误消息。无效请求的类别如下：

##### 未知的命令
服务器接收命令请求的路径无法映射到REST服务的资源时，应响应 404 Not Found 的消息。

##### 未实现命令
所有实现的 WebDriver JSON Wire 协议的服务器必须为每个已定义的命令做出响应。对于尚未实现的命令，服务器应用响应 501 Not Implemented 的错误消息。注意，这是在无效请求的类别，不应返回 4xx 的状态代码。

##### 可变资源未找到
如果请求路径映射到与变量相关的资源，但该资源不存在，服务器应用响应 404 Not Found 。例如，ID 为 my-session 不是服务器上一个有效的会话ID，那么当命令发送到 GET /session/my-session HTTP/1.1 时服务器应该优雅地返回 404 。

##### 无效命令方法
如果请求的路径映射到一个有效的资源，但该资源并不支持请求的方法，服务器应回应 405 Method Not Allowed 。应该配置好请求的资源允许的方法列表。

##### 缺少命令参数
如果 POST / PUT 命令映射到一组需要 JSON 参数的资源，但该请求不包括那些参数之一，服务器应响应 400 Bad Request 。响应主体应该列出缺少的参数。

#### 失败的命令

如果请求映射到一个有效的命令，并包含所有预期的参数，但未能成功执行，那么服务器应该发送一个 500 的服务器内部错误。这种响应的 Content-Type 应为 application/json;charset=UTF-8，消息体应是一个结构良好的 JSON 对象。

响应状态应该是预定义的状态代码之一，消息体应为描述失败的命令详细信息的 JSON 对象：

|Key|类型|描述|
|---|---|---|
|message|string|该命令失败的描述消息。|
|screen|string	|可选）当前页面截图的 Base64 编码字符串。|
|class|string|（可选）命令失败抛出的异常的完整类名。|
|stackTrace|array|（可选）命令失败时抛出的异常堆栈，应为一个 JSON 数组。该数组应以 0 为第一个索引。|

堆栈跟踪数组中的每个JSON对象必须包含以下属性：

|Key|类型|描述|
|---|---|---|
|fileName|string|源文件的名称。
|className|string	|完整的类名。如果无法确定类的名称，或者服务器采用了不适用类名的实现语言，此属性应该被设置为空字符串。|
|methodName|string|调用的方法，或者空字符串，如果未知或不适用。|
|lineNumber|number|源文件中的行号，如果不明，应为 0 。|

## 资源映射

WebDriver REST 服务上的资源都映射到独立的 URL 上。每个资源可响应一个或多个HTTP请求方法。如果资源响应 GET 请求，它也应该支持响应 HEAD 请求。所有资源都响应 OPTIONS 请求，并在响应头中带有 allow 域，其值是该资源所支持的所有请求方法的列表。

如果资源被映射到包含变量路径段的 URL 上，路由应进一步处理该变量路径段。变量路径段以冒号前缀表示。例如：

    /favorite/color/:person

映射到这个 URL 的资源应该解析 :person 变量，并一步确定如何响应请求。例如请求 URL 为 /favorite/color/Jack ，那么它应该返回 Jack 最喜欢的颜色。同样，如果请求 URL 为 /favorite/color/Jill ，服务器应当返回 Jill 最喜欢的颜色。

只有资源路径匹配模式包含相同的变量路径段，两个资源才可映射到相同的 URL 模式上，否则不行。服务器应总是将请求路由到其路径是请求的最佳匹配的资源上。请看以下两个资源路径：

1. /session/:sessionId/element/active
* /session/:sessionId/element/:id

上面的映射，服务器应始终将路径以 active 结尾的请求映射到第一个资源上。所有其他的请求都应该被路由到第二个资源上。

## 命令参考

### 命令摘要

|HTTP方法|路径|说明|
|---|---|---|
|GET|[/status](#status)|查询服务器的当前状态。|
|POST|[/session](#session)|创建一个新的会话。|
|GET|[/sessions](#sessions)|返回当前的活动会话列表。|
|GET|[/session/:sessionId](#sessionsessionid)|获取指定会话的能力信息。|
|DELETE|[/session/:sessionId](#sessionsessionid)|删除指定的会话。|
|POST|[/session/:sessionId/timeouts](sessionsessionIdtimeouts)|配置操作的超时时间，超过超时时间，操作将被取消。|
|POST|[/session/:sessionId/timeouts/async_script](#sessionsessionidtimeoutsasync_script)|设置使用 /session/:sessionId/execute_async 命令执行异步脚本的超时时间（以毫秒为单位），超过该时间操作将被取消。|
|POST|[/session/:sessionId/timeouts/implicit_wait](#sessionsessionidtimeoutsimplicit_wait)|设置搜索元素的超时时间。|
|GET|[/session/:sessionId/window_handle](#sessionsessionidwindow_handle)|获取当前窗口的句柄。|
|GET|[/session/:sessionId/window_handles](#sessionsessionidwindow_handles)|获取当前会话中的所有窗口的句柄列表。|
|GET|[/session/:sessionId/url](#sessionsessionidurl)|获取当前页面的URL。|
|POST|[/session/:sessionId/url](#sessionsessionidurl)|将当前会话导航到一个新的URL。|
|POST|[/session/:sessionId/forward](#sessionsessionidforward)|如果可用，相当于点击浏览器的前进按钮。|
|POST|[/session/:sessionId/back](#sessionsessionidback)|如果可用，相当于点击浏览器的后退按钮。|
|POST|[/session/:sessionId/refresh](#sessionsessionidrefresh)|刷新当前页面。|
|POST|[/session/:sessionId/execute](#sessionsessionidexecute)|在当前页面执行指定的JavaScript代码段。|
|POST|[/session/:sessionId/execute_async](#sessionsessionidexecute_async)|在当前页面异步执行指定的JavaScript代码段。|
|GET|[/session/:sessionId/screenshot](#sessionsessionidscreenshot)|获取当前页面的屏幕截图。|
|GET|[/session/:sessionId/ime/available_engines](#sessionsessionidimeavailable_engines)|列出设备上所有可用的输入法。|
|GET|[/session/:sessionId/ime/active_engine](#sessionsessionidimeactive_engine)|获取当前激活的输入法名称。|
|GET|[/session/:sessionId/ime/activated](#sessionsessionidimeactivated)|查询当前输入法是否处于激活状态（如果不是激活状态，返回NOT) 。|
|POST|[/session/:sessionId/ime/deactivate](#sessionsessionidimedeactivate)|关闭当前活动的输入法。|
|POST|[/session/:sessionId/ime/activate](#sessionsessionidimeactivate)|激活一个输入法（可在通过 getAvailableEngines 获取可用的输入法列表）。|
|POST|[/session/:sessionId/frame](#sessionsessionidframe)|将当前页面的焦点切换到指定 frame 上。|
|POST|[/session/:sessionId/frame/parent](#sessionsessionidframeparent)|将焦点转到父 frame 上。|
|POST|[/session/:sessionId/window](#sessionsessionidwindow)|将焦点更改到另一个窗口上。|
|DELETE|[/session/:sessionId/window](#sessionsessionidwindow)|关闭当前窗口。|
|POST|[/session/:sessionId/window/:windowHandle/size](#sessionsessionidwindowwindowhandlesize)|改变指定的窗口的大小。|
|GET|[/session/:sessionId/window/:windowHandle/size](#sessionsessionidwindowwindowhandlesize)|获取指定的窗口的大小。|
|POST|[/session/:sessionId/window/:windowHandle/position](#sessionsessionidwindowwindowhandleposition)|改变指定窗口的位置。|
|GET|[/session/:sessionId/window/:windowHandle/position](#sessionsessionidwindowwindowhandleposition)|获取指定的窗口的位置。|
|POST|[/session/:sessionId/window/:windowHandle/maximize](#sessionsessionidwindowwindowhandlemaximize)|最大化指定的窗口（如果没有最大化）。|
|GET|[/session/:sessionId/cookie](#sessionsessionidcookie)|获取当前页面的 Cookie。|
|POST|[/session/:sessionId/cookie](#sessionsessionidcookie)|设置 Cookie。|
|DELETE|[/session/:sessionId/cookie](#sessionsessionidcookie)|删除当前页面的 Cookie。|
|DELETE|[/session/:sessionId/cookie/:name](#sessionsessionidcookiename)|删除指定 Cookie 的指定 Key。|
|GET|[/session/:sessionId/source](#sessionsessionidsource)|获取当前页面的源代码。|
|GET|[/session/:sessionId/title](#sessionsessionidtitle)|获取当前页面的标题。|
|POST|[/session/:sessionId/element](#sessionsessionidelement)|从文档根搜索页面上的一个元素。|
|POST|[/session/:sessionId/elements](#sessionsessionidelements)|从文档根搜索页面上的多个元素。|
|POST|[/session/:sessionId/element/active](#sessionsessionidelementactive)|获取当前页面上具有焦点的元素。|
|GET|[/session/:sessionId/element/:id](#sessionsessionidelementid)|获取指定的元素。|
|POST|[/session/:sessionId/element/:id/element](#sessionsessionidelementidelement)|以指定元素为根搜索单个元素。|
|POST|[/session/:sessionId/element/:id/elements](#sessionsessionidelementidelements)|以指定元素为根搜索多个元素。|
|POST|[/session/:sessionId/element/:id/click](#sessionsessionidelementidclick)|点击一个指定的元素。|
|POST|[/session/:sessionId/element/:id/submit](#sessionsessionidelementidsubmit)|提交 FORM 元素。|
|GET|[/session/:sessionId/element/:id/text](#sessionsessionidelementidtext)|返回指定元素的可见文本。|
|POST|[/session/:sessionId/element/:id/value](#sessionsessionidelementidvalue)|发送按键序列到指定元素。|
|POST|[/session/:sessionId/keys](#sessionsessionidkeys)|发送按键序列到当前的焦点元素。|
|GET|[/session/:sessionId/element/:id/name](#sessionsessionidelementidname)|获取指定元素的标签名。|
|POST|[/session/:sessionId/element/:id/clear](#sessionsessionidelementidclear)|清除指定 TEXTAREA 或 text INPUT 元素的值。|
|GET|[/session/:sessionId/element/:id/selected](#sessionsessionidelementidselected)|获取指定 OPTION 、 INPUT 、checkbox 或 radiobutton 元素当前的选择值。|
|GET|[/session/:sessionId/element/:id/enabled](#sessionsessionidelementidenabled)|获取指定元素是否可用。|
|GET|[/session/:sessionId/element/:id/attribute/:name](#sessionsessionidelementidattributename)|获取指定元素的指定属性的值。|
|GET|[/session/:sessionId/element/:id/equals/:other](#sessionsessionidelementidequalsother)|测试两个元素ID是否指代相同的DOM元素。|
|GET|[/session/:sessionId/element/:id/displayed](#sessionsessionidelementiddisplayed)|测试指定的元素是否可见。|
|GET|[/session/:sessionId/element/:id/location](#sessionsessionidelementidlocation)|获取指定元素在网页上的位置。|
|GET|[/session/:sessionId/element/:id/location_in_view](#sessionsessionidelementidlocation_in_view)|测试一个元素的位置是否在屏幕可视区域内。|
|GET|[/session/:sessionId/element/:id/size](#sessionsessionidelementidsize)|获取指定元素的大小。|
|GET|[/session/:sessionId/element/:id/css/:propertyName](#sessionsessionidelementidcsspropertyname)|获取指定元素的指定CSS属性的计算值。|
|GET|[/session/:sessionId/orientation](#sessionsessionidorientation)|获取当前浏览器的方向。|
|POST|[/session/:sessionId/orientation](#sessionsessionidorientation)|设置浏览器的方向。|
|GET|[/session/:sessionId/alert_text](#sessionsessionidalert_text)|获取当前显示的 alert() 、 confirm()或prompt() 对话框中的文本。|
|POST|[/session/:sessionId/alert_text](#sessionsessionidalert_text)|发送按键序列到当前的 prompt() 对话框中。|
|POST|[/session/:sessionId/accept_alert](#sessionsessionidaccept_alert)|接受当前显示的 alert 对话框。|
|POST|[/session/:sessionId/dismiss_alert](#sessionsessioniddismiss_alert)|取消当前显示的 alert 对话框。|
|POST|[/session/:sessionId/moveto](#sessionsessionidmoveto)|使鼠标在指定元素上移动指定的偏移。|
|POST|[/session/:sessionId/click](#sessionsessionidclick)|点击鼠标按钮（点击位置为 moveTo 命令设置的坐标）。|
|POST|[/session/:sessionId/buttondown](#sessionsessionidbuttondown)|按下鼠标左键（按下坐标为 moveTo 命令设置的坐标）。|
|POST|[/session/:sessionId/buttonup](#sessionsessionidbuttonup)|释放鼠标之前按下的按键。|
|POST|[/session/:sessionId/doubleclick](#sessionsessioniddoubleclick)|双击鼠标（坐标通过 MoveTo 设置）。|
|POST|[/session/:sessionId/touch/click](#sessionsessionidtouchclick)|在触摸屏上发送一个轻触事件。|
|POST|[/session/:sessionId/touch/down](#sessionsessionidtouchdown)|在触摸屏上发送手指按下事件。|
|POST|[/session/:sessionId/touch/up](#sessionsessionidtouchup)|在触摸屏上发送手指抬起事件。|
|POST|[/session/:sessionId/touch/move](#sessionsessionidtouchmove)|在触摸屏上移动手指。|
|POST|[/session/:sessionId/touch/scroll](#sessionsessionidtouchscroll)|在触摸屏上发送基于手指运动的滚动事件。|
|POST|[/session/:sessionId/touch/doubleclick](#sessionsessionidtouchdoubleclick)|在触摸屏上发送手指双击事件。|
|POST|[/session/:sessionId/touch/longclick](#sessionsessionidtouchlongclick)|在触摸屏上发送手指长按动事件。|
|POST|[/session/:sessionId/touch/flick](#sessionsessionidtouchflick)|在触摸屏上发送手指滑动事件。|
|GET|[/session/:sessionId/location](#sessionsessionidlocation)|获取当前地理位置。|
|POST|[/session/:sessionId/location](#sessionsessionidlocation)|设置当前地理位置。|
|GET|[/session/:sessionId/local_storage](#sessionsessionidlocal_storage)|获取 local storage 存储的数据。|
|POST|[/session/:sessionId/local_storage](#sessionsessionidlocal_storage)|设置 local storage 存储的数据。|
|DELETE|[/session/:sessionId/local_storage](#sessionsessionidlocal_storage)|清除 local storage 存储的数据。|
|GET|[/session/:sessionId/local_storage/key/:key](#sessionsessionidlocal_storagekeykey)|获取 local storage 存储中指定 key 的值。|
|DELETE|[/session/:sessionId/local_storage/key/:key](#sessionsessionidlocal_storagekeykey)|删除 local storage 存储中指定 key 的值。|
|GET|[/session/:sessionId/local_storage/size](#sessionsessionidlocal_storagesize)|获取 local storage 存储中条目的数量。|
|GET|[/session/:sessionId/session_storage](#sessionsessionidsession_storage)|获取 session storage 存储的数据。|
|POST|[/session/:sessionId/session_storage](#sessionsessionidsession_storage)|设置 session storage 存储的数据。|
|DELETE|[/session/:sessionId/session_storage](#sessionsessionidsession_storage)|清除 session storage 存储的数据。|
|GET|[/session/:sessionId/session_storage/key/:key](#sessionsessionidsession_storagekeykey)|获取 session storage 存储中指定 key 的值。|
|DELETE|[/session/:sessionId/session_storage/key/:key](#sessionsessionidsession_storagekeykey)|删除 session storage 存储中指定 key 的值。|
|GET|[/session/:sessionId/session_storage/size](#sessionsessionidsession_storagesize)|获取 session storage 存储中条目的数量。|
|POST|[/session/:sessionId/log](#sessionsessionidlog)|获取指定会话的日志类型。|
|GET|[/session/:sessionId/log/types](#sessionsessionidlogtypes)|获取指定会话的可用的日志类型。|
|GET|[/session/:sessionId/application_cache/status](#sessionsessionidapplication_cachestatus)|使用HTML5应用程序缓存的状态。|

## Command Detail

### /status

<dl>
<dd>
<h4>GET /status</h4>
</dd>
<dd>
<dl>
<dd>
Query the server's current status.  The server should respond with a general "HTTP 200 OK" response if it is alive and accepting commands. The response body should be a JSON object describing the state of the server. All server implementations should return two basic objects describing the server's current platform and when the server was built. All fields are optional; if omitted, the client should assume the value is uknown. Furthermore, server implementations may include additional fields not listed here.<br>
<br>
<table><thead><th> <b>Key</b> </th><th> <b>Type</b> </th><th> <b>Description</b> </th></thead><tbody>
<tr><td> build      </td><td> object      </td><td>                    </td></tr>
<tr><td> build.version </td><td> string      </td><td> A generic release label (i.e. "2.0rc3") </td></tr>
<tr><td> build.revision </td><td> string      </td><td> The revision of the local source control client from which the server was built </td></tr>
<tr><td> build.time </td><td> string      </td><td> A timestamp from when the server was built. </td></tr>
<tr><td> os         </td><td> object      </td><td>                    </td></tr>
<tr><td> os.arch    </td><td> string      </td><td> The current system architecture. </td></tr>
<tr><td> os.name    </td><td> string      </td><td> The name of the operating system the server is currently running on: "windows", "linux", etc. </td></tr>
<tr><td> os.version </td><td> string      </td><td> The operating system version. </td></tr></tbody></table>

</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{object}</code> An object describing the general status of the server.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session

<dl>
<dd>
<h4>POST /session</h4>
</dd>
<dd>
<dl>
<dd>
Create a new session. The server should attempt to create a session that most closely matches the desired and required capabilities. Required capabilities have higher priority than desired capabilities and must be set for the session to be created.</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>desiredCapabilities</code> - <code>{object}</code> An object describing the session's <a href='#Desired_Capabilities.md'>desired capabilities</a>.</dd>
<dd><code>requiredCapabilities</code> - <code>{object}</code> An object describing the session's <a href='#Desired_Capabilities.md'>required capabilities</a> (Optional).</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{object}</code> An object describing the session's <a href='#Actual_Capabilities.md'>capabilities</a>.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>SessionNotCreatedException</code> - If a required capability could not be set.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /sessions

<dl>
<dd>
<h4>GET /sessions</h4>
</dd>
<dd>
<dl>
<dd>
Returns a list of the currently active sessions. Each session will be returned as a list of JSON objects with the following keys:<br>
<br>
<table><thead><th> <b>Key</b> </th><th> <b>Type</b> </th><th> <b>Description</b></th></thead><tbody>
<tr><td> id         </td><td> string      </td><td> The session ID. </td></tr>
<tr><td> capabilities </td><td> object      </td><td> An object describing the session's <a href='#Actual_Capabilities.md'>capabilities</a>. </td></tr></tbody></table>

</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{Array.&lt;Object&gt;}</code> A list of the currently active sessions.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId

<dl>
<dd>
<h4>GET /session/:sessionId</h4>
</dd>
<dd>
<dl>
<dd>Retrieve the capabilities of the specified session.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{object}</code> An object describing the session's <a href='#Actual_Capabilities.md'>capabilities</a>.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>

<dl>
<dd>
<h4>DELETE /session/:sessionId</h4>
</dd>
<dd>
<dl>
<dd>Delete the session.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/timeouts

<dl>
<dd>
<h4>POST /session/:sessionId/timeouts</h4>
</dd>
<dd>
<dl>
<dd>
Configure the amount of time that a particular type of operation can execute for before they are aborted and a |Timeout| error is returned to the client.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>type</code> - <code>{string}</code> The type of operation to set the timeout for. Valid values are: "script" for script timeouts, "implicit" for modifying the implicit wait timeout and "page load" for setting a page load timeout.</dd>
<dd><code>ms</code> - <code>{number}</code> The amount of time, in milliseconds, that time-limited commands are permitted to run.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/timeouts/async\_script

<dl>
<dd>
<h4>POST /session/:sessionId/timeouts/async_script</h4>
</dd>
<dd>
<dl>
<dd>Set the amount of time, in milliseconds, that asynchronous scripts executed by <code>/session/:sessionId/execute_async</code> are permitted to run before they are aborted and a |Timeout| error is returned to the client.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>ms</code> - <code>{number}</code> The amount of time, in milliseconds, that time-limited commands are permitted to run.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/timeouts/implicit\_wait

<dl>
<dd>
<h4>POST /session/:sessionId/timeouts/implicit_wait</h4>
</dd>
<dd>
<dl>
<dd>Set the amount of time the driver should wait when searching for elements. When<br>
searching for a single element, the driver should poll the page until an element is found or<br>
the timeout expires, whichever occurs first. When searching for multiple elements, the driver<br>
should poll the page until at least one element is found or the timeout expires, at which point<br>
it should return an empty list.<br>
<br>
If this command is never sent, the driver should default to an implicit wait of 0ms.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>ms</code> - <code>{number}</code> The amount of time to wait, in milliseconds. This value has a lower bound of 0.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/window\_handle

<dl>
<dd>
<h4>GET /session/:sessionId/window_handle</h4>
</dd>
<dd>
<dl>
<dd>Retrieve the current window handle.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{string}</code> The current window handle.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/window\_handles

<dl>
<dd>
<h4>GET /session/:sessionId/window_handles</h4>
</dd>
<dd>
<dl>
<dd>Retrieve the list of all window handles available to the session.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{Array.&lt;string&gt;}</code> A list of window handles.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/url

<dl>
<dd>
<h4>GET /session/:sessionId/url</h4>
</dd>
<dd>
<dl>
<dd>Retrieve the URL of the current page.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{string}</code> The current URL.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>

<dl>
<dd>
<h4>POST /session/:sessionId/url</h4>
</dd>
<dd>
<dl>
<dd>Navigate to a new URL.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>url</code> - <code>{string}</code> The URL to navigate to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/forward

<dl>
<dd>
<h4>POST /session/:sessionId/forward</h4>
</dd>
<dd>
<dl>
<dd>Navigate forwards in the browser history, if possible.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/back

<dl>
<dd>
<h4>POST /session/:sessionId/back</h4>
</dd>
<dd>
<dl>
<dd>Navigate backwards in the browser history, if possible.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/refresh

<dl>
<dd>
<h4>POST /session/:sessionId/refresh</h4>
</dd>
<dd>
<dl>
<dd>Refresh the current page.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/execute

<dl>
<dd>
<h4>POST /session/:sessionId/execute</h4>
</dd>
<dd>
<dl>
<dd>
Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame. The executed script is assumed to be synchronous and the result of evaluating the script is returned to the client.<br>
<br>
The <code>script</code> argument defines the script to execute in the form of a function body.  The value returned by that function will be returned to the client.  The function will be invoked with the provided <code>args</code> array and the values may be accessed via the <code>arguments</code> object in the order specified.<br>
<br>
Arguments may be any JSON-primitive, array, or JSON object.  JSON objects that define a <a href='#WebElement_JSON_Object.md'>WebElement reference</a> will be converted to the corresponding DOM element. Likewise, any WebElements in the script result will be returned to the client as <a href='#WebElement_JSON_Object.md'>WebElement JSON objects</a>.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>script</code> - <code>{string}</code> The script to execute.</dd>
<dd><code>args</code> - <code>{Array.&lt;*&gt;}</code> The script arguments.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{*}</code> The script result.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>StaleElementReference</code> - If one of the script arguments is a WebElement that is not attached to the page's DOM.</dd>
<dd><code>JavaScriptError</code> - If the script throws an Error.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/execute\_async

<dl>
<dd>
<h4>POST /session/:sessionId/execute_async</h4>
</dd>
<dd>
<dl>
<dd>
Inject a snippet of JavaScript into the page for execution in the context of the currently selected frame. The executed script is assumed to be asynchronous and must signal that is done by invoking the provided callback, which is always provided as the final argument to the function.  The value to this callback will be returned to the client.<br>
<br>
Asynchronous script commands may not span page loads.  If an <code>unload</code> event is fired while waiting for a script result, an error should be returned to the client.<br>
<br>
The <code>script</code> argument defines the script to execute in teh form of a function body.  The function will be invoked with the provided <code>args</code> array and the values may be accessed via the <code>arguments</code> object in the order specified. The final argument will always be a callback function that must be invoked to signal that the script has finished.<br>
<br>
Arguments may be any JSON-primitive, array, or JSON object.  JSON objects that define a <a href='#WebElement_JSON_Object.md'>WebElement reference</a> will be converted to the corresponding DOM element. Likewise, any WebElements in the script result will be returned to the client as <a href='#WebElement_JSON_Object.md'>WebElement JSON objects</a>.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>script</code> - <code>{string}</code> The script to execute.</dd>
<dd><code>args</code> - <code>{Array.&lt;*&gt;}</code> The script arguments.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{*}</code> The script result.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>StaleElementReference</code> - If one of the script arguments is a WebElement that is not attached to the page's DOM.</dd>
<dd><code>Timeout</code> - If the script callback is not invoked before the timout expires. Timeouts are controlled by the <code>/session/:sessionId/timeout/async_script</code> command.</dd>
<dd><code>JavaScriptError</code> - If the script throws an Error or if an <code>unload</code> event is fired while waiting for the script to finish.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/screenshot

<dl>
<dd>
<h4>GET /session/:sessionId/screenshot</h4>
</dd>
<dd>
<dl>
<dd>Take a screenshot of the current page.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{string}</code> The screenshot as a base64 encoded PNG.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/ime/available\_engines

<dl>
<dd>
<h4>GET /session/:sessionId/ime/available_engines</h4>
</dd>
<dd>
<dl>
<dd>List all available engines on the machine. To use an engine, it has to be present in this list.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{Array.&lt;string&gt;}</code> A list of available engines</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>ImeNotAvailableException</code> - If the host does not support IME</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/ime/active\_engine

<dl>
<dd>
<h4>GET /session/:sessionId/ime/active_engine</h4>
</dd>
<dd>
<dl>
<dd>Get the name of the active IME engine. The name string is platform specific.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{string}</code> The name of the active IME engine.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>ImeNotAvailableException</code> - If the host does not support IME</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/ime/activated

<dl>
<dd>
<h4>GET /session/:sessionId/ime/activated</h4>
</dd>
<dd>
<dl>
<dd>Indicates whether IME input is active at the moment (not if it's available.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{boolean}</code> true if IME input is available and currently active, false otherwise</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>ImeNotAvailableException</code> - If the host does not support IME</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/ime/deactivate

<dl>
<dd>
<h4>POST /session/:sessionId/ime/deactivate</h4>
</dd>
<dd>
<dl>
<dd>De-activates the currently-active IME engine.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>ImeNotAvailableException</code> - If the host does not support IME</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/ime/activate

<dl>
<dd>
<h4>POST /session/:sessionId/ime/activate</h4>
</dd>
<dd>
<dl>
<dd>Make an engines that is available (appears on the list<br>
returned by getAvailableEngines) active. After this call, the engine will<br>
be added to the list of engines loaded in the IME daemon and the input sent<br>
using sendKeys will be converted by the active engine.<br>
Note that this is a platform-independent method of activating IME<br>
(the platform-specific way being using keyboard shortcuts</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>engine</code> - <code>{string}</code> Name of the engine to activate.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>ImeActivationFailedException</code> - If the engine is not available or if the activation fails for other reasons.</dd>
<dd><code>ImeNotAvailableException</code> - If the host does not support IME</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/frame

<dl>
<dd>
<h4>POST /session/:sessionId/frame</h4>
</dd>
<dd>
<dl>
<dd>Change focus to another frame on the page. If the frame <code>id</code> is <code>null</code>, the server<br>
should switch to the page's default content.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>id</code> - <code>{string|number|null|WebElement JSON Object}</code> Identifier for the frame to change focus to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>NoSuchFrame</code> - If the frame specified by <code>id</code> cannot be found.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/frame/parent

<dl>
<dd>
<h4>POST /session/:sessionId/frame/parent</h4>
</dd>
<dd>
<dl>
<dd>Change focus to the parent context. If the current context is the top level browsing context, the context remains unchanged.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/window

<dl>
<dd>
<h4>POST /session/:sessionId/window</h4>
</dd>
<dd>
<dl>
<dd>Change focus to another window. The window to change focus to may be specified by its<br>
server assigned window handle, or by the value of its <code>name</code> attribute.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>name</code> - <code>{string}</code> The window to change focus to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the window specified by <code>name</code> cannot be found.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>

<dl>
<dd>
<h4>DELETE /session/:sessionId/window</h4>
</dd>
<dd>
<dl>
<dd>Close the current window.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window is already closed</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/window/:windowHandle/size

<dl>
<dd>
<h4>POST /session/:sessionId/window/:windowHandle/size</h4>
</dd>
<dd>
<dl>
<dd>Change the size of the specified window. If the :windowHandle URL parameter is "current", the currently active window will be resized.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>width</code> - <code>{number}</code> The new window width.</dd>
<dd><code>height</code> - <code>{number}</code> The new window height.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>

<dl>
<dd>
<h4>GET /session/:sessionId/window/:windowHandle/size</h4>
</dd>
<dd>
<dl>
<dd>Get the size of the specified window. If the :windowHandle URL parameter is "current", the size of the currently active window will be returned.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{width: number, height: number}</code> The size of the window.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the specified window cannot be found.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/window/:windowHandle/position

<dl>
<dd>
<h4>POST /session/:sessionId/window/:windowHandle/position</h4>
</dd>
<dd>
<dl>
<dd>Change the position of the specified window. If the :windowHandle URL parameter is "current", the currently active window will be moved.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>x</code> - <code>{number}</code> The X coordinate to position the window at, relative to the upper left corner of the screen.</dd>
<dd><code>y</code> - <code>{number}</code> The Y coordinate to position the window at, relative to the upper left corner of the screen.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the specified window cannot be found.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>

<dl>
<dd>
<h4>GET /session/:sessionId/window/:windowHandle/position</h4>
</dd>
<dd>
<dl>
<dd>Get the position of the specified window. If the :windowHandle URL       parameter is "current", the position of the currently active window will be returned.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{x: number, y: number}</code> The X and Y coordinates for the window, relative to the upper left corner of the screen.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the specified window cannot be found.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/window/:windowHandle/maximize

<dl>
<dd>
<h4>POST /session/:sessionId/window/:windowHandle/maximize</h4>
</dd>
<dd>
<dl>
<dd>Maximize the specified window if not already maximized. If the :windowHandle URL parameter is "current", the currently active window will be maximized.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the specified window cannot be found.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/cookie

<dl>
<dd>
<h4>GET /session/:sessionId/cookie</h4>
</dd>
<dd>
<dl>
<dd>Retrieve all cookies visible to the current page.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{Array.&lt;object&gt;}</code> A list of <a href='#Cookie_JSON_Object.md'>cookies</a>.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>

<dl>
<dd>
<h4>POST /session/:sessionId/cookie</h4>
</dd>
<dd>
<dl>
<dd>Set a cookie. If the <a href='#Cookie_JSON_Object.md'>cookie</a> path is not specified, it should be set to <code>"/"</code>. Likewise, if the domain is omitted, it should default to the current page's domain.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>cookie</code> - <code>{object}</code> A <a href='#Cookie_JSON_Object.md'>JSON object</a> defining the cookie to add.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>

<dl>
<dd>
<h4>DELETE /session/:sessionId/cookie</h4>
</dd>
<dd>
<dl>
<dd>Delete all cookies visible to the current page.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>InvalidCookieDomain</code> - If the cookie's <code>domain</code> is not visible from the current page.</dd>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>UnableToSetCookie</code> - If attempting to set a cookie on a page that does not support cookies (e.g. pages with mime-type <code>text/plain</code>).</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/cookie/:name

<dl>
<dd>
<h4>DELETE /session/:sessionId/cookie/:name</h4>
</dd>
<dd>
<dl>
<dd>Delete the cookie with the given name. This command should be a no-op if there is no<br>
such cookie visible to the current page.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:name</code> - The name of the cookie to delete.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/source

<dl>
<dd>
<h4>GET /session/:sessionId/source</h4>
</dd>
<dd>
<dl>
<dd>Get the current page source.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{string}</code> The current page source.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/title

<dl>
<dd>
<h4>GET /session/:sessionId/title</h4>
</dd>
<dd>
<dl>
<dd>Get the current page title.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{string}</code> The current page title.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/element

<dl>
<dd>
<h4>POST /session/:sessionId/element</h4>
</dd>
<dd>
<dl>
<dd>Search for an element on the page, starting from the document root. The located element will be returned as a WebElement JSON object. The table below lists the locator strategies that each server should support. Each locator must return the first matching element located in the DOM.<br>
<br>
<table><thead><th> <b>Strategy</b> </th><th> <b>Description</b> </th></thead><tbody>
<tr><td> class name      </td><td> Returns an element whose class name contains the search value; compound class names are not permitted. </td></tr>
<tr><td> css selector    </td><td> Returns an element matching a CSS selector. </td></tr>
<tr><td> id              </td><td> Returns an element whose ID attribute matches the search value. </td></tr>
<tr><td> name            </td><td> Returns an element whose NAME attribute matches the search value. </td></tr>
<tr><td> link text       </td><td> Returns an anchor element whose visible text matches the search value. </td></tr>
<tr><td> partial link text </td><td> Returns an anchor element whose visible text partially matches the search value. </td></tr>
<tr><td> tag name        </td><td> Returns an element whose tag name matches the search value. </td></tr>
<tr><td> xpath           </td><td> Returns an element matching an XPath expression. </td></tr></tbody></table>

</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>using</code> - <code>{string}</code> The locator strategy to use.</dd>
<dd><code>value</code> - <code>{string}</code> The The search target.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{ELEMENT:string}</code> A WebElement JSON object for the located element.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>NoSuchElement</code> - If the element cannot be found.</dd>
<dd><code>XPathLookupError</code> - If using XPath and the input expression is invalid.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/elements

<dl>
<dd>
<h4>POST /session/:sessionId/elements</h4>
</dd>
<dd>
<dl>
<dd>Search for multiple elements on the page, starting from the document root. The located elements will be returned as a WebElement JSON objects. The table below lists the locator strategies that each server should support. Elements should be returned in the order located in the DOM.<br>
<br>
<table><thead><th> <b>Strategy</b> </th><th> <b>Description</b> </th></thead><tbody>
<tr><td> class name      </td><td> Returns all elements whose class name contains the search value; compound class names are not permitted. </td></tr>
<tr><td> css selector    </td><td> Returns all elements matching a CSS selector. </td></tr>
<tr><td> id              </td><td> Returns all elements whose ID attribute matches the search value. </td></tr>
<tr><td> name            </td><td> Returns all elements whose NAME attribute matches the search value. </td></tr>
<tr><td> link text       </td><td> Returns all anchor elements whose visible text matches the search value. </td></tr>
<tr><td> partial link text </td><td> Returns all anchor elements whose visible text partially matches the search value. </td></tr>
<tr><td> tag name        </td><td> Returns all elements whose tag name matches the search value. </td></tr>
<tr><td> xpath           </td><td> Returns all elements matching an XPath expression. </td></tr></tbody></table>

</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>using</code> - <code>{string}</code> The locator strategy to use.</dd>
<dd><code>value</code> - <code>{string}</code> The The search target.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{Array.&lt;{ELEMENT:string}&gt;}</code> A list of WebElement JSON objects for the located elements.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>XPathLookupError</code> - If using XPath and the input expression is invalid.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/element/active

<dl>
<dd>
<h4>POST /session/:sessionId/element/active</h4>
</dd>
<dd>
<dl>
<dd>Get the element on the page that currently has focus. The element will be returned as a WebElement JSON object.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{ELEMENT:string}</code> A WebElement JSON object for the active element.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/element/:id

<dl>
<dd>
<h4>GET /session/:sessionId/element/:id</h4>
</dd>
<dd>
<dl>
<dd>Describe the identified element.<br>
<br>
<b>Note:</b> This command is reserved for future use; its return type is currently undefined.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:id</code> - ID of the element to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>StaleElementReference</code> - If the element referenced by <code>:id</code> is no longer attached to the page's DOM.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/element/:id/element

<dl>
<dd>
<h4>POST /session/:sessionId/element/:id/element</h4>
</dd>
<dd>
<dl>
<dd>Search for an element on the page, starting from the identified element. The located element will be returned as a WebElement JSON object. The table below lists the locator strategies that each server should support. Each locator must return the first matching element located in the DOM.<br>
<br>
<table><thead><th> <b>Strategy</b> </th><th> <b>Description</b> </th></thead><tbody>
<tr><td> class name      </td><td> Returns an element whose class name contains the search value; compound class names are not permitted. </td></tr>
<tr><td> css selector    </td><td> Returns an element matching a CSS selector. </td></tr>
<tr><td> id              </td><td> Returns an element whose ID attribute matches the search value. </td></tr>
<tr><td> name            </td><td> Returns an element whose NAME attribute matches the search value. </td></tr>
<tr><td> link text       </td><td> Returns an anchor element whose visible text matches the search value. </td></tr>
<tr><td> partial link text </td><td> Returns an anchor element whose visible text partially matches the search value. </td></tr>
<tr><td> tag name        </td><td> Returns an element whose tag name matches the search value. </td></tr>
<tr><td> xpath           </td><td> Returns an element matching an XPath expression. The provided XPath expression must be applied to the server "as is"; if the expression is not relative to the element root, the server should not modify it. Consequently, an XPath query may return elements not contained in the root element's subtree. </td></tr></tbody></table>

</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:id</code> - ID of the element to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>using</code> - <code>{string}</code> The locator strategy to use.</dd>
<dd><code>value</code> - <code>{string}</code> The The search target.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{ELEMENT:string}</code> A WebElement JSON object for the located element.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>StaleElementReference</code> - If the element referenced by <code>:id</code> is no longer attached to the page's DOM.</dd>
<dd><code>NoSuchElement</code> - If the element cannot be found.</dd>
<dd><code>XPathLookupError</code> - If using XPath and the input expression is invalid.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/element/:id/elements

<dl>
<dd>
<h4>POST /session/:sessionId/element/:id/elements</h4>
</dd>
<dd>
<dl>
<dd>Search for multiple elements on the page, starting from the identified element. The located elements will be returned as a WebElement JSON objects. The table below lists the locator strategies that each server should support. Elements should be returned in the order located in the DOM.<br>
<br>
<table><thead><th> <b>Strategy</b> </th><th> <b>Description</b> </th></thead><tbody>
<tr><td> class name      </td><td> Returns all elements whose class name contains the search value; compound class names are not permitted. </td></tr>
<tr><td> css selector    </td><td> Returns all elements matching a CSS selector. </td></tr>
<tr><td> id              </td><td> Returns all elements whose ID attribute matches the search value. </td></tr>
<tr><td> name            </td><td> Returns all elements whose NAME attribute matches the search value. </td></tr>
<tr><td> link text       </td><td> Returns all anchor elements whose visible text matches the search value. </td></tr>
<tr><td> partial link text </td><td> Returns all anchor elements whose visible text partially matches the search value. </td></tr>
<tr><td> tag name        </td><td> Returns all elements whose tag name matches the search value. </td></tr>
<tr><td> xpath           </td><td> Returns all elements matching an XPath expression. The provided XPath expression must be applied to the server "as is"; if the expression is not relative to the element root, the server should not modify it. Consequently, an XPath query may return elements not contained in the root element's subtree. </td></tr></tbody></table>

</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:id</code> - ID of the element to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>using</code> - <code>{string}</code> The locator strategy to use.</dd>
<dd><code>value</code> - <code>{string}</code> The The search target.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{Array.&lt;{ELEMENT:string}&gt;}</code> A list of WebElement JSON objects for the located elements.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>StaleElementReference</code> - If the element referenced by <code>:id</code> is no longer attached to the page's DOM.</dd>
<dd><code>XPathLookupError</code> - If using XPath and the input expression is invalid.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/element/:id/click

<dl>
<dd>
<h4>POST /session/:sessionId/element/:id/click</h4>
</dd>
<dd>
<dl>
<dd>Click on an element.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:id</code> - ID of the element to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>StaleElementReference</code> - If the element referenced by <code>:id</code> is no longer attached to the page's DOM.</dd>
<dd><code>ElementNotVisible</code> - If the referenced element is not visible on the page (either is hidden by CSS, has 0-width, or has 0-height)</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/element/:id/submit

<dl>
<dd>
<h4>POST /session/:sessionId/element/:id/submit</h4>
</dd>
<dd>
<dl>
<dd>Submit a <code>FORM</code> element. The submit command may also be applied to any element that is a descendant of a <code>FORM</code> element.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:id</code> - ID of the element to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>StaleElementReference</code> - If the element referenced by <code>:id</code> is no longer attached to the page's DOM.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/element/:id/text

<dl>
<dd>
<h4>GET /session/:sessionId/element/:id/text</h4>
</dd>
<dd>
<dl>
<dd>Returns the visible text for the element.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:id</code> - ID of the element to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>StaleElementReference</code> - If the element referenced by <code>:id</code> is no longer attached to the page's DOM.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/element/:id/value

<dl>
<dd>
<h4>POST /session/:sessionId/element/:id/value</h4>
</dd>
<dd>
<dl>
<dd>Send a sequence of key strokes to an element.<br>
<br>
Any UTF-8 character may be specified, however, if the server does not support native key events, it should simulate key strokes for a standard US keyboard layout. The Unicode <a href='http://unicode.org/faq/casemap_charprop.html#8'>Private Use Area</a> code points, 0xE000-0xF8FF, are used to represent pressable, non-text  keys (see table below).<br>
<br>
<br>
<table cellpadding='5' cellspacing='5'>
<tbody><tr><td valign='top'>
<table><thead><th> <b>Key</b> </th><th> <b>Code</b> </th></thead><tbody>
<tr><td> NULL       </td><td> U+E000      </td></tr>
<tr><td> Cancel     </td><td> U+E001      </td></tr>
<tr><td> Help       </td><td> U+E002      </td></tr>
<tr><td> Back space </td><td> U+E003      </td></tr>
<tr><td> Tab        </td><td> U+E004      </td></tr>
<tr><td> Clear      </td><td> U+E005      </td></tr>
<tr><td> Return<sup>1</sup> </td><td> U+E006      </td></tr>
<tr><td> Enter<sup>1</sup> </td><td> U+E007      </td></tr>
<tr><td> Shift      </td><td> U+E008      </td></tr>
<tr><td> Control    </td><td> U+E009      </td></tr>
<tr><td> Alt        </td><td> U+E00A      </td></tr>
<tr><td> Pause      </td><td> U+E00B      </td></tr>
<tr><td> Escape     </td><td> U+E00C      </td></tr></tbody></table>

</td><td valign='top'>
<table><thead><th> <b>Key</b> </th><th> <b>Code</b> </th></thead><tbody>
<tr><td> Space      </td><td> U+E00D      </td></tr>
<tr><td> Pageup     </td><td> U+E00E      </td></tr>
<tr><td> Pagedown   </td><td> U+E00F      </td></tr>
<tr><td> End        </td><td> U+E010      </td></tr>
<tr><td> Home       </td><td> U+E011      </td></tr>
<tr><td> Left arrow </td><td> U+E012      </td></tr>
<tr><td> Up arrow   </td><td> U+E013      </td></tr>
<tr><td> Right arrow </td><td> U+E014      </td></tr>
<tr><td> Down arrow </td><td> U+E015      </td></tr>
<tr><td> Insert     </td><td> U+E016      </td></tr>
<tr><td> Delete     </td><td> U+E017      </td></tr>
<tr><td> Semicolon  </td><td> U+E018      </td></tr>
<tr><td> Equals     </td><td> U+E019      </td></tr></tbody></table>

</td><td valign='top'>
<table><thead><th> <b>Key</b> </th><th> <b>Code</b> </th></thead><tbody>
<tr><td> Numpad 0   </td><td> U+E01A      </td></tr>
<tr><td> Numpad 1   </td><td> U+E01B      </td></tr>
<tr><td> Numpad 2   </td><td> U+E01C      </td></tr>
<tr><td> Numpad 3   </td><td> U+E01D      </td></tr>
<tr><td> Numpad 4   </td><td> U+E01E      </td></tr>
<tr><td> Numpad 5   </td><td> U+E01F      </td></tr>
<tr><td> Numpad 6   </td><td> U+E020      </td></tr>
<tr><td> Numpad 7   </td><td> U+E021      </td></tr>
<tr><td> Numpad 8   </td><td> U+E022      </td></tr>
<tr><td> Numpad 9   </td><td> U+E023      </td></tr></tbody></table>

</td><td valign='top'>
<table><thead><th> <b>Key</b> </th><th> <b>Code</b> </th></thead><tbody>
<tr><td> Multiply   </td><td> U+E024      </td></tr>
<tr><td> Add        </td><td> U+E025      </td></tr>
<tr><td> Separator  </td><td> U+E026      </td></tr>
<tr><td> Subtract   </td><td> U+E027      </td></tr>
<tr><td> Decimal    </td><td> U+E028      </td></tr>
<tr><td> Divide     </td><td> U+E029      </td></tr></tbody></table>

</td><td valign='top'>
<table><thead><th> <b>Key</b> </th><th> <b>Code</b> </th></thead><tbody>
<tr><td> F1         </td><td> U+E031      </td></tr>
<tr><td> F2         </td><td> U+E032      </td></tr>
<tr><td> F3         </td><td> U+E033      </td></tr>
<tr><td> F4         </td><td> U+E034      </td></tr>
<tr><td> F5         </td><td> U+E035      </td></tr>
<tr><td> F6         </td><td> U+E036      </td></tr>
<tr><td> F7         </td><td> U+E037      </td></tr>
<tr><td> F8         </td><td> U+E038      </td></tr>
<tr><td> F9         </td><td> U+E039      </td></tr>
<tr><td> F10        </td><td> U+E03A      </td></tr>
<tr><td> F11        </td><td> U+E03B      </td></tr>
<tr><td> F12        </td><td> U+E03C      </td></tr>
<tr><td> Command/Meta </td><td> U+E03D      </td></tr></tbody></table>

</td></tr>
<tr><td><sup>1</sup> The return key is <i>not the same</i> as the <a href='http://en.wikipedia.org/wiki/Enter_key'>enter key</a>.</td></tr></tbody></table>

The server must process the key sequence as follows:<br>
<ul><li>Each key that appears on the keyboard without requiring modifiers are sent as a keydown followed by a key up.<br>
</li><li>If the server does not support native events and must simulate key strokes with JavaScript, it must generate keydown, keypress, and keyup events, in that order. The keypress event should only be fired when the corresponding key is for a printable character.<br>
</li><li>If a key requires a modifier key (e.g. "!" on a standard US keyboard), the sequence is: <var>modifier</var> down, <var>key</var> down, <var>key</var> up, <var>modifier</var> up, where <var>key</var> is the ideal unmodified key value (using the previous example, a "1").<br>
</li><li>Modifier keys (Ctrl, Shift, Alt, and Command/Meta) are assumed to be "sticky"; each modifier should be held down (e.g. only a keydown event) until either the modifier is encountered again in the sequence, or the <code>NULL</code> (U+E000) key is encountered.<br>
</li><li>Each key sequence is terminated with an implicit <code>NULL</code> key. Subsequently, all depressed modifier keys must be released (with corresponding keyup events) at the end of the sequence.<br>
</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:id</code> - ID of the element to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>value</code> - <code>{Array.&lt;string&gt;}</code> The sequence of keys to type. An array must be provided. The server should flatten the array items to a single string to be typed.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>StaleElementReference</code> - If the element referenced by <code>:id</code> is no longer attached to the page's DOM.</dd>
<dd><code>ElementNotVisible</code> - If the referenced element is not visible on the page (either is hidden by CSS, has 0-width, or has 0-height)</dd>
</dl>
</dd>
</dl>
</dd>
</dl></li></ul>


---


### /session/:sessionId/keys

<dl>
<dd>
<h4>POST /session/:sessionId/keys</h4>
</dd>
<dd>
<dl>
<dd>Send a sequence of key strokes to the active element. This command is similar to the <a href='JsonWireProtocol#/session/:sessionId/element/:id/value.md'>send keys</a> command in every aspect except the implicit termination: The modifiers are <b>not</b> released at the end of the call. Rather, the state of the modifier keys is kept between calls, so mouse interactions can be performed while modifier keys are depressed.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>value</code> - <code>{Array.&lt;string&gt;}</code> The keys sequence to be sent. The sequence is defined in the<a href='JsonWireProtocol#/session/:sessionId/element/:id/value.md'>send keys</a> command.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/element/:id/name

<dl>
<dd>
<h4>GET /session/:sessionId/element/:id/name</h4>
</dd>
<dd>
<dl>
<dd>Query for an element's tag name.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:id</code> - ID of the element to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{string}</code> The element's tag name, as a lowercase string.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>StaleElementReference</code> - If the element referenced by <code>:id</code> is no longer attached to the page's DOM.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/element/:id/clear

<dl>
<dd>
<h4>POST /session/:sessionId/element/:id/clear</h4>
</dd>
<dd>
<dl>
<dd>Clear a <code>TEXTAREA</code> or <code>text INPUT</code> element's value.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:id</code> - ID of the element to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>StaleElementReference</code> - If the element referenced by <code>:id</code> is no longer attached to the page's DOM.</dd>
<dd><code>ElementNotVisible</code> - If the referenced element is not visible on the page (either is hidden by CSS, has 0-width, or has 0-height)</dd>
<dd><code>InvalidElementState</code> - If the referenced element is disabled.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/element/:id/selected

<dl>
<dd>
<h4>GET /session/:sessionId/element/:id/selected</h4>
</dd>
<dd>
<dl>
<dd>Determine if an <code>OPTION</code> element, or an <code>INPUT</code> element of type <code>checkbox</code> or <code>radiobutton</code> is currently selected.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:id</code> - ID of the element to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{boolean}</code> Whether the element is selected.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>StaleElementReference</code> - If the element referenced by <code>:id</code> is no longer attached to the page's DOM.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/element/:id/enabled

<dl>
<dd>
<h4>GET /session/:sessionId/element/:id/enabled</h4>
</dd>
<dd>
<dl>
<dd>Determine if an element is currently enabled.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:id</code> - ID of the element to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{boolean}</code> Whether the element is enabled.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>StaleElementReference</code> - If the element referenced by <code>:id</code> is no longer attached to the page's DOM.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/element/:id/attribute/:name

<dl>
<dd>
<h4>GET /session/:sessionId/element/:id/attribute/:name</h4>
</dd>
<dd>
<dl>
<dd>Get the value of an element's attribute.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:id</code> - ID of the element to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{string|null}</code> The value of the attribute, or null if it is not set on the element.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>StaleElementReference</code> - If the element referenced by <code>:id</code> is no longer attached to the page's DOM.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/element/:id/equals/:other

<dl>
<dd>
<h4>GET /session/:sessionId/element/:id/equals/:other</h4>
</dd>
<dd>
<dl>
<dd>Test if two element IDs refer to the same DOM element.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:id</code> - ID of the element to route the command to.</dd>
<dd><code>:other</code> - ID of the element to compare against.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{boolean}</code> Whether the two IDs refer to the same element.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>StaleElementReference</code> - If either the element refered to by <code>:id</code> or <code>:other</code> is no longer attached to the page's DOM.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/element/:id/displayed

<dl>
<dd>
<h4>GET /session/:sessionId/element/:id/displayed</h4>
</dd>
<dd>
<dl>
<dd>Determine if an element is currently displayed.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:id</code> - ID of the element to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{boolean}</code> Whether the element is displayed.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>StaleElementReference</code> - If the element referenced by <code>:id</code> is no longer attached to the page's DOM.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/element/:id/location

<dl>
<dd>
<h4>GET /session/:sessionId/element/:id/location</h4>
</dd>
<dd>
<dl>
<dd>Determine an element's location on the page. The point <code>(0, 0)</code> refers to the upper-left corner of the page. The element's coordinates are returned as a JSON object with <code>x</code> and <code>y</code> properties.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:id</code> - ID of the element to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{x:number, y:number}</code> The X and Y coordinates for the element on the page.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>StaleElementReference</code> - If the element referenced by <code>:id</code> is no longer attached to the page's DOM.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/element/:id/location\_in\_view

<dl>
<dd>
<h4>GET /session/:sessionId/element/:id/location_in_view</h4>
</dd>
<dd>
<dl>
<dd>Determine an element's location on the screen once it has been scrolled into view.<br>
<br>
<b>Note:</b> This is considered an internal command and should <b>only</b> be used to determine an element's<br>
location for correctly generating native events.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:id</code> - ID of the element to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{x:number, y:number}</code> The X and Y coordinates for the element.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>StaleElementReference</code> - If the element referenced by <code>:id</code> is no longer attached to the page's DOM.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/element/:id/size

<dl>
<dd>
<h4>GET /session/:sessionId/element/:id/size</h4>
</dd>
<dd>
<dl>
<dd>Determine an element's size in pixels. The size will be returned as a JSON object  with <code>width</code> and <code>height</code> properties.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:id</code> - ID of the element to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{width:number, height:number}</code> The width and height of the element, in pixels.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>StaleElementReference</code> - If the element referenced by <code>:id</code> is no longer attached to the page's DOM.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/element/:id/css/:propertyName

<dl>
<dd>
<h4>GET /session/:sessionId/element/:id/css/:propertyName</h4>
</dd>
<dd>
<dl>
<dd>Query the value of an element's computed CSS property. The CSS property to query should be specified using the CSS property name, <b>not</b> the JavaScript property name (e.g. <code>background-color</code> instead of <code>backgroundColor</code>).</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:id</code> - ID of the element to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{string}</code> The value of the specified CSS property.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
<dd><code>StaleElementReference</code> - If the element referenced by <code>:id</code> is no longer attached to the page's DOM.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/orientation

<dl>
<dd>
<h4>GET /session/:sessionId/orientation</h4>
</dd>
<dd>
<dl>
<dd>Get the current browser orientation. The server should return a valid orientation value as defined in <a href='http://selenium.googlecode.com/git/docs/api/java/org/openqa/selenium/ScreenOrientation.html'>ScreenOrientation</a>: <code>{LANDSCAPE|PORTRAIT}</code>.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{string}</code> The current browser orientation corresponding to a value defined in <a href='http://selenium.googlecode.com/git/docs/api/java/org/openqa/selenium/ScreenOrientation.html'>ScreenOrientation</a>: <code>{LANDSCAPE|PORTRAIT}</code>.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>

<dl>
<dd>
<h4>POST /session/:sessionId/orientation</h4>
</dd>
<dd>
<dl>
<dd>Set the browser orientation. The orientation should be specified as defined in <a href='http://selenium.googlecode.com/git/docs/api/java/org/openqa/selenium/ScreenOrientation.html'>ScreenOrientation</a>: <code>{LANDSCAPE|PORTRAIT}</code>.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>orientation</code> - <code>{string}</code> The new browser orientation as defined in <a href='http://selenium.googlecode.com/git/docs/api/java/org/openqa/selenium/ScreenOrientation.html'>ScreenOrientation</a>: <code>{LANDSCAPE|PORTRAIT}</code>.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/alert\_text

<dl>
<dd>
<h4>GET /session/:sessionId/alert_text</h4>
</dd>
<dd>
<dl>
<dd>Gets the text of the currently displayed JavaScript <code>alert()</code>, <code>confirm()</code>, or <code>prompt()</code> dialog.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{string}</code> The text of the currently displayed alert.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoAlertPresent</code> - If there is no alert displayed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>

<dl>
<dd>
<h4>POST /session/:sessionId/alert_text</h4>
</dd>
<dd>
<dl>
<dd>Sends keystrokes to a JavaScript <code>prompt()</code> dialog.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>text</code> - <code>{string}</code> Keystrokes to send to the <code>prompt()</code> dialog.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoAlertPresent</code> - If there is no alert displayed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/accept\_alert

<dl>
<dd>
<h4>POST /session/:sessionId/accept_alert</h4>
</dd>
<dd>
<dl>
<dd>Accepts the currently displayed alert dialog. Usually, this is equivalent to clicking on the 'OK' button in the dialog.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoAlertPresent</code> - If there is no alert displayed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/dismiss\_alert

<dl>
<dd>
<h4>POST /session/:sessionId/dismiss_alert</h4>
</dd>
<dd>
<dl>
<dd>Dismisses the currently displayed alert dialog. For <code>confirm()</code> and <code>prompt()</code> dialogs, this is equivalent to clicking the 'Cancel' button. For <code>alert()</code> dialogs, this is equivalent to clicking the 'OK' button.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoAlertPresent</code> - If there is no alert displayed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/moveto

<dl>
<dd>
<h4>POST /session/:sessionId/moveto</h4>
</dd>
<dd>
<dl>
<dd>Move the mouse by an offset of the specificed element. If no element is specified, the move is relative to the current mouse cursor. If an element is provided but no offset, the mouse will be moved to the center of the element. If the element is not visible, it will be scrolled into view.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>element</code> - <code>{string}</code> Opaque ID assigned to the element to move to, as described in the WebElement JSON Object. If not specified or is null, the offset is relative to current position of the mouse.</dd>
<dd><code>xoffset</code> - <code>{number}</code> X offset to move to, relative to the top-left corner of the element. If not specified, the mouse will move to the middle of the element.</dd>
<dd><code>yoffset</code> - <code>{number}</code> Y offset to move to, relative to the top-left corner of the element. If not specified, the mouse will move to the middle of the element.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/click

<dl>
<dd>
<h4>POST /session/:sessionId/click</h4>
</dd>
<dd>
<dl>
<dd>Click any mouse button (at the coordinates set by the last moveto command). Note that calling this command after calling buttondown and before calling button up (or any out-of-order interactions sequence) will yield undefined behaviour).</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>button</code> - <code>{number}</code> Which button, enum: <code>{LEFT = 0, MIDDLE = 1 , RIGHT = 2}</code>. Defaults to the left mouse button if not specified.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/buttondown

<dl>
<dd>
<h4>POST /session/:sessionId/buttondown</h4>
</dd>
<dd>
<dl>
<dd>Click and hold the left mouse button (at the coordinates set by the last moveto command). Note that the next mouse-related command that should follow is buttonup . Any other mouse command (such as click or another call to buttondown) will yield undefined behaviour.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>button</code> - <code>{number}</code> Which button, enum: <code>{LEFT = 0, MIDDLE = 1 , RIGHT = 2}</code>. Defaults to the left mouse button if not specified.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/buttonup

<dl>
<dd>
<h4>POST /session/:sessionId/buttonup</h4>
</dd>
<dd>
<dl>
<dd>Releases the mouse button previously held (where the mouse is currently at). Must be called once for every buttondown command issued. See the note in click and buttondown about implications of out-of-order commands.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>button</code> - <code>{number}</code> Which button, enum: <code>{LEFT = 0, MIDDLE = 1 , RIGHT = 2}</code>. Defaults to the left mouse button if not specified.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/doubleclick

<dl>
<dd>
<h4>POST /session/:sessionId/doubleclick</h4>
</dd>
<dd>
<dl>
<dd>Double-clicks at the current mouse coordinates (set by moveto).</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/touch/click

<dl>
<dd>
<h4>POST /session/:sessionId/touch/click</h4>
</dd>
<dd>
<dl>
<dd>Single tap on the touch enabled device.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>element</code> - <code>{string}</code> ID of the element to single tap on.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/touch/down

<dl>
<dd>
<h4>POST /session/:sessionId/touch/down</h4>
</dd>
<dd>
<dl>
<dd>Finger down on the screen.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>x</code> - <code>{number}</code> X coordinate on the screen.</dd>
<dd><code>y</code> - <code>{number}</code> Y coordinate on the screen.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/touch/up

<dl>
<dd>
<h4>POST /session/:sessionId/touch/up</h4>
</dd>
<dd>
<dl>
<dd>Finger up on the screen.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>x</code> - <code>{number}</code> X coordinate on the screen.</dd>
<dd><code>y</code> - <code>{number}</code> Y coordinate on the screen.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### session/:sessionId/touch/move

<dl>
<dd>
<h4>POST session/:sessionId/touch/move</h4>
</dd>
<dd>
<dl>
<dd>Finger move on the screen.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>x</code> - <code>{number}</code> X coordinate on the screen.</dd>
<dd><code>y</code> - <code>{number}</code> Y coordinate on the screen.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### session/:sessionId/touch/scroll

<dl>
<dd>
<h4>POST session/:sessionId/touch/scroll</h4>
</dd>
<dd>
<dl>
<dd>Scroll on the touch screen using finger based motion events. Use this command to start scrolling at a particular screen location.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>element</code> - <code>{string}</code> ID of the element where the scroll starts.</dd>
<dd><code>xoffset</code> - <code>{number}</code> The x offset in pixels to scroll by.</dd>
<dd><code>yoffset</code> - <code>{number}</code> The y offset in pixels to scroll by.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### session/:sessionId/touch/scroll

<dl>
<dd>
<h4>POST session/:sessionId/touch/scroll</h4>
</dd>
<dd>
<dl>
<dd>Scroll on the touch screen using finger based motion events. Use this command if you don't care where the scroll starts on the screen.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>xoffset</code> - <code>{number}</code> The x offset in pixels to scrollby.</dd>
<dd><code>yoffset</code> - <code>{number}</code> The y offset in pixels to scrollby.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### session/:sessionId/touch/doubleclick

<dl>
<dd>
<h4>POST session/:sessionId/touch/doubleclick</h4>
</dd>
<dd>
<dl>
<dd>Double tap on the touch screen using finger motion events.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>element</code> - <code>{string}</code> ID of the element to double tap on.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### session/:sessionId/touch/longclick

<dl>
<dd>
<h4>POST session/:sessionId/touch/longclick</h4>
</dd>
<dd>
<dl>
<dd>Long press on the touch screen using finger motion events.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>element</code> - <code>{string}</code> ID of the element to long press on.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### session/:sessionId/touch/flick

<dl>
<dd>
<h4>POST session/:sessionId/touch/flick</h4>
</dd>
<dd>
<dl>
<dd>Flick on the touch screen using finger motion events. This flickcommand starts at a particulat screen location.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>element</code> - <code>{string}</code> ID of the element where the flick starts.</dd>
<dd><code>xoffset</code> - <code>{number}</code> The x offset in pixels to flick by.</dd>
<dd><code>yoffset</code> - <code>{number}</code> The y offset in pixels to flick by.</dd>
<dd><code>speed</code> - <code>{number}</code> The speed in pixels per seconds.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### session/:sessionId/touch/flick

<dl>
<dd>
<h4>POST session/:sessionId/touch/flick</h4>
</dd>
<dd>
<dl>
<dd>Flick on the touch screen using finger motion events. Use this flick command if you don't care where the flick starts on the screen.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>xspeed</code> - <code>{number}</code> The x speed in pixels per second.</dd>
<dd><code>yspeed</code> - <code>{number}</code> The y speed in pixels per second.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/location

<dl>
<dd>
<h4>GET /session/:sessionId/location</h4>
</dd>
<dd>
<dl>
<dd>Get the current geo location.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{latitude: number, longitude: number, altitude: number}</code> The current geo location.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>

<dl>
<dd>
<h4>POST /session/:sessionId/location</h4>
</dd>
<dd>
<dl>
<dd>Set the current geo location.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>location</code> - <code>{latitude: number, longitude: number, altitude: number}</code> The new location.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/local\_storage

<dl>
<dd>
<h4>GET /session/:sessionId/local_storage</h4>
</dd>
<dd>
<dl>
<dd>Get all keys of the storage.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{Array.&lt;string&gt;}</code> The list of keys.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>

<dl>
<dd>
<h4>POST /session/:sessionId/local_storage</h4>
</dd>
<dd>
<dl>
<dd>Set the storage item for the given key.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>key</code> - <code>{string}</code> The key to set.</dd>
<dd><code>value</code> - <code>{string}</code> The value to set.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>

<dl>
<dd>
<h4>DELETE /session/:sessionId/local_storage</h4>
</dd>
<dd>
<dl>
<dd>Clear the storage.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/local\_storage/key/:key

<dl>
<dd>
<h4>GET /session/:sessionId/local_storage/key/:key</h4>
</dd>
<dd>
<dl>
<dd>Get the storage item for the given key.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:key</code> - The key to get.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>

<dl>
<dd>
<h4>DELETE /session/:sessionId/local_storage/key/:key</h4>
</dd>
<dd>
<dl>
<dd>Remove the storage item for the given key.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:key</code> - The key to remove.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/local\_storage/size

<dl>
<dd>
<h4>GET /session/:sessionId/local_storage/size</h4>
</dd>
<dd>
<dl>
<dd>Get the number of items in the storage.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{number}</code> The number of items in the storage.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/session\_storage

<dl>
<dd>
<h4>GET /session/:sessionId/session_storage</h4>
</dd>
<dd>
<dl>
<dd>Get all keys of the storage.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{Array.&lt;string&gt;}</code> The list of keys.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>

<dl>
<dd>
<h4>POST /session/:sessionId/session_storage</h4>
</dd>
<dd>
<dl>
<dd>Set the storage item for the given key.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>key</code> - <code>{string}</code> The key to set.</dd>
<dd><code>value</code> - <code>{string}</code> The value to set.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>

<dl>
<dd>
<h4>DELETE /session/:sessionId/session_storage</h4>
</dd>
<dd>
<dl>
<dd>Clear the storage.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/session\_storage/key/:key

<dl>
<dd>
<h4>GET /session/:sessionId/session_storage/key/:key</h4>
</dd>
<dd>
<dl>
<dd>Get the storage item for the given key.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:key</code> - The key to get.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>

<dl>
<dd>
<h4>DELETE /session/:sessionId/session_storage/key/:key</h4>
</dd>
<dd>
<dl>
<dd>Remove the storage item for the given key.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
<dd><code>:key</code> - The key to remove.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/session\_storage/size

<dl>
<dd>
<h4>GET /session/:sessionId/session_storage/size</h4>
</dd>
<dd>
<dl>
<dd>Get the number of items in the storage.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{number}</code> The number of items in the storage.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Potential Errors:</b></dt>
<dd><code>NoSuchWindow</code> - If the currently selected window has been closed.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/log

<dl>
<dd>
<h4>POST /session/:sessionId/log</h4>
</dd>
<dd>
<dl>
<dd>Get the log for a given log type. Log buffer is reset after each request.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>JSON Parameters:</b></dt>
<dd><code>type</code> - <code>{string}</code> The <a href='#Log_Type.md'>log type</a>. This must be provided.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{Array.&lt;object&gt;}</code> The list of <a href='#Log_Entry_JSON_Object.md'>log entries</a>.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/log/types

<dl>
<dd>
<h4>GET /session/:sessionId/log/types</h4>
</dd>
<dd>
<dl>
<dd>Get available log types.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{Array.&lt;string&gt;}</code> The list of available <a href='#Log_Type.md'>log types</a>.</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


---


### /session/:sessionId/application\_cache/status

<dl>
<dd>
<h4>GET /session/:sessionId/application_cache/status</h4>
</dd>
<dd>
<dl>
<dd>Get the status of the html5 application cache.</dd>
<dd>
<dl>
<dt><b>URL Parameters:</b></dt>
<dd><code>:sessionId</code> - ID of the session to route the command to.</dd>
</dl>
</dd>
<dd>
<dl>
<dt><b>Returns:</b></dt>
<dd><code>{number}</code> Status code for application cache: {UNCACHED = 0, IDLE = 1, CHECKING = 2, DOWNLOADING = 3, UPDATE_READY = 4, OBSOLETE = 5}</dd>
</dl>
</dd>
</dl>
</dd>
</dl>


