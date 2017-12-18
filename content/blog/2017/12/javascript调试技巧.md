# 一些有用的调试技巧

本文收集的调试技巧大多来自 Chrome Command Line API，了解以下对日常的代码调试会非常有帮助。

## Command Line API

首先说说什么是 Command Line API ？

Command Line API 其实是 Chrome 调试工具的便捷函数集合：包括选择和检查 DOM 元素，以可读格式显示数据，停止和启动分析器，以及监控 DOM 事件等等。

> 需要注意的是这些 API 仅能通过控制台本身获取。无法通过网页上的脚本（即 JavaScript）访问 Command Line API。

## $_

功能很简单，就是返回最近执行的表达式的结果。

```
> 1 + 1
> 2
> $_
> 2
```

## $0 - $4

$0、$1、$2、$3 和 $4 返回最近 5 次选择的 DOM 元素或 JavaScript 对象，选择的来源有两个：

* Elements 面板中检查的 DOM 元素
    * 就是指我们通过鼠标在页面上点选或在元素代码上点选的元素
* Profiles 面板中选择的 JavaScript 对象
    * 这个是在 Memory 选项卡里，Profiling Type 选 Take heap snapshot，再点 take snapshot 按钮，在生成的 Snapshot 中点选的对象

$0 返回最近一次选择的元素或 JavaScript 对象，$1 返回仅在最近一次之前选择的元素或对象，依此类推。

## inspect(object/function)

在相应的面板中打开并选择指定的元素或对象：针对 DOM 元素使用 Elements 面板，或针对 JavaScript 堆对象使用 Profiles 面板。

与上一条的两种选择来源相对应。

## $(selector)

返回带有指定的 CSS 选择器的``第一个`` DOM 元素的引用。此函数等同于  document.querySelector() 函数。

> 注意如果您使的用库占用了$，例如 jQuery，则此功能将被覆盖， $ 将与该库的实现对应。

## $$(selector)

$$(selector) 返回与给定 CSS 选择器匹配的元素数组。此命令等同于调用 document.querySelectorAll()。

## $x(path)

返回一个与给定 XPath 表达式匹配的 DOM 元素数组。

## copy(object)

将指定对象以字符串的形式复制到剪贴板中。

## debug/undebug(function)

调用指定的函数时，将触发调试程序，并在 Sources 面板上使函数内部中断，从而允许逐行执行代码并进行调试。

使用 undebug(fn) 停止函数中断，或使用 UI 停用所有断点。

## monitor/unmonitor(function)

调用指定函数时，系统会向控制台记录一条消息，其中指明函数名称及在调用时传递到该函数的参数。

使用 unmonitor(function) 停止监控。

## getEventListeners(object)

getEventListeners(object) 返回在指定对象上注册的事件侦听器。

返回值是一个对象，其包含每个注册的事件类型（例如，“click”或“keydown”）数组。每个数组的成员是描述为每个类型注册的侦听器的对象。

例如，下面命令可以列出在文档对象上注册的所有事件侦听器：

```javascript
getEventListeners(document);
```

## monitorEvents(object[, events])

当在指定对象上发生一个指定事件时，将 Event 对象记录到控制台。您可以指定一个要监控的单独事件、一个事件数组或一个映射到预定义事件集合的常规事件“类型”。

例如以下命令监控 window 对象上的所有 resize 事件。

```javascript
monitorEvents(window, "resize");
```

也支持同时监听多个事件，如下面的命令同时监控 window 上的 "resize" 和 "scroll" 事件：

```
monitorEvents(window, ["resize", "scroll"])
```

您还可以指定一个可用的事件“类型”、映射到预定义事件集的字符串。下表列出了可用的事件类型及其相关的事件映射：

|事件类型|对应的事件|
|---|---|
|mouse|"mousedown", "mouseup", "click", "dblclick", "mousemove", "mouseover", "mouseout", "mousewheel"|
|key|"keydown", "keyup", "keypress", "textInput"|
|touch|"touchstart", "touchmove", "touchend", "touchcancel"|
|control|"resize", "scroll", "zoom", "focus", "blur", "select", "change", "submit", "reset"|

例如，以下示例为 Elements 面板上当前选择的输入文本字段上的所有对应 key 事件使用使用“key”事件类型。

```javascript
monitorEvents($0, "key");
```

使用 unmonitorEvents(object[, events]) 取消监控

## 控制台的其他技巧

### 换行

在控制台中按 Shift + Enter 以开始一个新行，不会执行脚本。

## debugger

``debugger`` 是一个一直被我忽视的调试工具。把它写到代码里，在打开开发者工具的情况下，运行到该语句时就会自动自动暂停。

一个比较有用的使用方式是用条件语句把它包裹起来，功能类似条件断点，实现仅在满足某些条件时暂停。

> debugger 不属于 Chrome Command Line API，所以是可以在 JavaScript 脚本中直接使用的。

> 虽然在不开启开发者工具时，debugger 不会影响代码的运行，但还是建议调试完毕后清除这些调试代码

## 节点变化时中断

有时 DOM 发生了变化，但我们却并不知道为什么会这样。不过，如果你需要调试 JavaScript，Chrome 可以在 DOM 元素发生变化的时候暂停处理。甚至可以监控它的属性。

具体就是在 Chrome 探查器上，右键点击某个元素，并选择中断（Break on）选项来设置。

## console.table(object/array)

使用这个函数，被打印的对象或数组会以表格形式输出，某些情况下比 console.dir 输出的结果更便于阅读。

## 动态修改JS代码

调试的代码其实是可以修改后保存立即生效的，只要修改过后按 Ctrl/Cmd + S 即可，当然如果刷新所有的修改都会丢失。

> 需要注意的是修改代码后保存，会引起被修改代码的文件重新加载并执行，代码执行顺序可能错乱。建议的做法是先在要修改的文件最开始的位置设置断点，断点后再修改代码并保存。

## 利用开发者工具格式化代码

在开发者工具中找到相关源码并打开，可以在界面上找到一个 "{}" 图标，即可将代码进行格式化，很多时候比一些 IDE 格式化的效果都好。

## 屏蔽不相关代码

我们经常在应用中引入多个库或框架。其中大多数都经过良好的测试且相对没有缺陷。但是，调试器仍然会进入与此调试任务无关的文件。解决方案是将不需要调试的脚本屏蔽掉。当然这也可以包括你自己的脚本。

具体做法就是在开发者工具中找到相关源码并打开，右键，选择 Blackbox script。使用相同的方法可以解除屏蔽。



