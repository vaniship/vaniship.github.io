# 为 Jupyter 编写 kernel

内核(kernel)是一个执行用户代码并返回其结果的程序。IPython 包含一个可以执行 Python 代码的内核(kernel)，其他开发者也编写了一些支持 [其他语言](https://github.com/jupyter/jupyter/wiki/Jupyter-kernels)的内核(kernel)。

jupyter 启动内核时，读取一个连接文件，说明如何与前端建立通信。

有两种方式来开发内核：

1. 重用 ipython 内核机制来处理通信： 前提是目标是语言可以用 Python 驱动，只需描述如何执行代码即可。详细信息请参阅：[wrapperkernels]()。
2. 用目标语言实现内核机制。这需要做更多的基础工作，但使用这个内核的人可能更愿意参与代码贡献，因为他们更熟悉语言目标语言。

## 连接文件

内核启动时可以获得链接文件的路径。 (详见: [kernelspecs]() 查看如何指定命令行参数).

连接文件应该只能由当前用户访问, 是一个 JSON 格式的文件，格式如下：

```json
{
  "control_port": 50160,
  "shell_port": 57503,
  "transport": "tcp",
  "signature_scheme": "hmac-sha256",
  "stdin_port": 52597,
  "hb_port": 42540,
  "ip": "127.0.0.1",
  "iopub_port": 40885,
  "key": "a0436f6c-1916-498b-8eb9-e81ab9368e84"
}
```

``transport``, ``ip`` 和五个以 ``_port`` 结尾的字段用于定义 [ZeroMQ](http://zeromq.org/) 的链接参数。

以上面文件为例，shell socket 的地址为: tcp://127.0.0.1:57503

为每个启动的内核随机选择新端口。

``signature_scheme`` 和 ``key`` 用于加密的对消息签名，以防止系统中的其他用户在这个内核上执行代码。

签名的计算方式详见 [wire_protocol]()

## 消息处理

在读取完连接文件并成功绑定所需的端口后，内核应该进入事件循环，监听心跳(heartbeat)、控制和 shell 套接字(socket)。

[心跳]()消息是前端用于检测内核是否正常工作的，收到时应该立即通过接收的套接字(socket)予以回应。

在控制和 shell 套接字(socket)上的消息应该被解析并验证签名。具体做法详见 [wire_protocol]()

内核通过在 iopub 套接字(socket)上发送消息来输出显示内容，在 stdin 套接字(socket)读取用户的文本输入。

* [messaging]() 各个套接字(socket)的详细区别，以及其中的消息
* [Creating Language Kernels for IPython](http://andrew.gibiansky.com/blog/ipython/ipython-kernels/) [IHaskell](https://github.com/gibiansky/IHaskell) 作者的博客
* [simple_kernel](https://github.com/dsblank/simple_kernel) 用 Python 实现的一个简单内核

## 内核定义(Kernel specs)

内核通过创建目录来标识到 IPython，该目录的名称用作内核的标识符。在如下路径：

||Unix|Windows|
|---|---|---|
|System|``/usr/share/jupyter/kernels``<br />``/usr/local/share/jupyter/kernels`` |``%PROGRAMDATA%\jupyter\kernels``|
|Env|``{sys.prefix}/share/jupyter/kernels``||
|User|``%APPDATA%\jupyter\kernels``(Linux)<br />``~/Library/Jupyter/kernels`` (Mac)|``%APPDATA%\jupyter\kernels``  |

用户路径优先于系统路径，名称忽略大小写，因此操作系统的文件系统是否大小写敏感, 可能会影响内核的选取的结果。

kernelspecs 会在 URL 和其他使用，所以 kernelspec 必须是一个简单的名称, 只能包含 ASCII 字符, ASCII 数字, 和以下简单分隔符: 连字符(``-``)、点号(``.``)、下划线(``_``)。

如果配置了 `JUPYTER_PATH` 环境变量，被指定路径也会被搜索。

在内核目录中, 有三类文件：

* ``kernel.json``
* ``kernel.js``
*  logo image files

目前没有使用其他文件，但是未来可能会有变化。

在这些目录中，最重要的文件是 **kernel.json**，这是一个 JSON 格式的字典，有如下属性:

* **argv**: 启动命令和参数。
  * The text ``{connection_file}`` in any argument will be replaced with the path to the connection file.
* **display_name**: 在 UI 中显示的内核名称。 支持 Unicode 编码。
* **language**: 内核支持的语言称。
  * 加载笔记时，如果没有找到和 kernelspec key (不同的机器可能不同) 匹配的内核, 匹配 `language` 字段的内核将被使用。
  * 这样的设计可以增强内核的匹配，例如任何 python 或 julia 内核上的笔记，在不同用户的环境中都能正确关联内核，即使他们的内核名称并不相同。
* **interrupt_mode** (可选):
  * 可以是 ``signal`` 或 ``message``，用来指定客户端中断内核单元执行的模式
  * ``signal``: 使用操作系统的信号机制发送中断“信号”，(例如 POSIX 系统的上的``SIGINT``)
  * ``message``: 通过控制通道发送 ``interrupt_request`` 消息 (详见 [`msging_interrupt`]())
  * 如果没有指定，默认为 ``signal`` 模式
* **env** (可选): 附加环境变量。在内核启动前，会被添加到当前的环境中。
* **metadata** (可选): 内核相关的属性数据
  * used by clients to aid clients in kernel selection.
  * Metadata added here should be namespaced for the tool reading and writing that metadata.

例如, IPython 的 kernel.json 文件如下:

```json
{
  "argv": ["python3", "-m", "IPython.kernel", "-f", "{connection_file}"],
  "display_name": "Python 3",
  "language": "python"
}
```

查看所有可用的内核列表，可执行如下命令:

```bash
jupyter kernelspec list
```

启动终端或 Qt 内核，可执行如下命令:

```bash
jupyter console --kernel $kernel_name
jupyter qtconsole --kernel $kernel_name
```

在 jupyter notebook 下拉菜单的新建按钮里将会显示所有可用的内核。
