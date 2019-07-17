# Systemd 的配置文件

## 文件的格式

配置文件是普通文本文件，可以用文本编辑器打开

`systemctl cat` 命令可以查看配置文件的内容

```bash
systemctl cat sshd.service
```

配置文件分成几个区块，每个区块的第一行，是用方括号表示的区别名，如 [Unit]，每个区块内部是一些等号连接的键值对。

> 注意
> * 配置文件的区块名和字段名，都是大小写敏感的
> * 键值对的等号两侧不能有空格。

## Unit 区块

`[Unit]` 区块通常是配置文件的第一个区块，用来定义 Unit 的元数据，以及配置与其他 Unit 的关系。主要字段如下:

* Description：简短描述
* Documentation：文档地址
* Requires：当前 Unit 依赖的其他 Unit，如果它们没有运行，当前 Unit 会启动失败
* Wants：与当前 Unit 配合的其他 Unit，如果它们没有运行，当前 Unit 不会启动失败
* BindsTo：与 Requires 类似，它指定的 Unit 如果退出，会导致当前 Unit 停止运行
* Before：如果该字段指定的 Unit 也要启动，那么必须在当前 Unit 之后启动
* After：如果该字段指定的 Unit 也要启动，那么必须在当前 Unit 之前启动
* Conflicts：指定的 Unit 不能与当前 Unit 同时运行
* Condition...：当前 Unit 运行必须满足的条件，否则不会运行
* Assert...：当前 Unit 运行必须满足的条件，否则报启动失败

## Install 区块

`[Install]` 通常是配置文件的最后一个区块，用来定义如何启动，以及是否开机启动。主要字段如下:

* WantedBy：它的值是一个或多个 Target，当前 Unit 激活时（enable）符号链接会放入 `/etc/systemd/system` 目录下面以 Target 名 + .wants后缀构成的子目录中
* RequiredBy：它的值是一个或多个 Target，当前 Unit 激活时（enable），符号链接会放入 `/etc/systemd/system` 目录下面以 Target 名 + .required后缀构成的子目录中
* Alias：当前 Unit 可用于启动的别名
* Also：当前 Unit 激活（enable）时，会被同时激活的其他 Unit

## Service 区块

`[Service]` 区块用来配置 Service，只有 Service 类型的 Unit 才有这个区块。主要字段如下:

* Type：定义启动时的进程行为，有以下几种值：
    * simple：默认值，执行 ExecStart 指定的命令，启动主进程
    * forking：以 fork 方式从父进程创建子进程，创建后父进程会立即退出
    * oneshot：一次性进程，Systemd 会等当前服务退出，再继续往下执行
    * dbus：当前服务通过 D-Bus 启动
    * notify：当前服务启动完毕，会通知 Systemd，再继续往下执行
    * idle：若有其他任务执行完毕，当前服务才会运行
* ExecStart：启动当前服务的命令
* ExecStartPre：启动当前服务之前执行的命令
* ExecStartPost：启动当前服务之后执行的命令
* ExecReload：重启当前服务时执行的命令
* ExecStop：停止当前服务时执行的命令
* ExecStopPost：停止当其服务之后执行的命令
* RestartSec：自动重启当前服务间隔的秒数
* Restart：定义何种情况 Systemd 会自动重启当前服务，可能的值包括：
    * always（总是重启）
    * on-success
    * on-failure
    * on-abnormal
    * on-abort
    * on-watchdog
* TimeoutSec：定义 Systemd 停止当前服务之前等待的秒数
* Environment：指定环境变量

Unit 配置文件的完整字段清单，可参考

* [官方文档](https://www.freedesktop.org/software/systemd/man/systemd.unit.html)
* [systemd.unit 译文](http://www.jinbuguo.com/systemd/systemd.unit.html#)
* [systemd.service 译文](http://www.jinbuguo.com/systemd/systemd.service.html#)
