# Systemd 使用

## 由来

早些年 Linux 一直采用 init 命令启动服务。

```bash
sudo /etc/init.d/apache2 start
# 或
sudo service apache2 start
```

该方法有以下两个缺点:

* 启动时间长: init 是串行启动，只有前一个进程启动完，才会启动下一个进程
* 启动脚本复杂: init 只是执行启动脚本，不管其他事情。脚本需要自己处理各种情况，这往往使得脚本变得复杂冗长

## Systemd 概述

而 Systemd 就是为了解决上面的问题而诞生的。

根据 Linux 惯例，字母d是守护进程（daemon）的缩写。 Systemd 这个名字的含义，就是它要守护整个系统。

使用了 Systemd，就不需要再用 init 了。Systemd 取代 initd 成为了系统的第一个进程（PID 等于 1），其他进程都是它的子进程。

Systemd 的优点是功能强大，使用方便，缺点是体系庞大，非常复杂。事实上，也有很多人反对使用 Systemd，理由就是它过于复杂，与操作系统的其他部分强耦合，违反 `keep simple, keep stupid` 的 Unix 哲学。

![Systemd 架构图](./images/systemd.png?w=100%)

## Systemd 组成

Systemd 不是一个命令，而是一组命令，涉及到系统管理的方方面面。

### systemctl

`systemctl` 是 Systemd 的主命令，用于管理系统。

```bash
# 重启系统
sudo systemctl reboot

# 关闭系统，切断电源
sudo systemctl poweroff

# 关闭系统，但不切断电源
sudo systemctl halt

# 暂停系统
sudo systemctl suspend

# 让系统进入休眠状态
sudo systemctl hibernate

# 让系统进入交互式休眠状态
sudo systemctl hybrid-sleep

# 启动进入救援状态（单用户状态）
sudo systemctl rescue

# 更多功能可查阅帮助 ...
```

### systemd-analyze

`systemd-analyze` 命令用于查看启动耗时

```bash
# 查看启动耗时
systemd-analyze

# 查看每个服务的启动耗时
systemd-analyze blame

# 显示树状启动流程
systemd-analyze critical-chain

# 显示指定服务的启动流
systemd-analyze critical-chain atd.service
```

### hostnamectl

`hostnamectl` 命令用于查看当前主机的信息，或设置主机名

```bash
# 显示当前主机的信息
hostnamectl

# 设置主机名
sudo hostnamectl set-hostname rhel7
```

> hostnamectl 还可以显示操作系统版本和 Linux 版本等信息

### localectl

`localectl` 命令用于查看本地化设置，或修改相关配置

```bash
# 查看本地化设置
localectl

# 设置本地化参数。
sudo localectl set-locale LANG=en_GB.utf8
sudo localectl set-keymap en_GB
```

### timedatectl

`timedatectl` 命令用于查看当前时区设置，或修改相关配置

```bash
# 查看当前时区设置
timedatectl

# 显示所有可用的时区
timedatectl list-timezones

# 设置当前时区
sudo timedatectl set-timezone America/New_York
sudo timedatectl set-time YYYY-MM-DD
sudo timedatectl set-time HH:MM:SS
```

### loginctl

`loginctl` 命令用于查看当前登录的用户

```bash
# 列出当前session
loginctl list-sessions

# 列出当前登录用户
loginctl list-users

# 列出显示指定用户的信息
loginctl show-user admin
```

## Systemd Unit

Systemd 可以管理所有系统资源。不同的资源统称为 Unit（单元）。

Unit 一共分成12种：

* Service：系统服务
* Target：多个 Unit 构成的一个组
* Device：硬件设备
* Mount：文件系统的挂载点
* Automount：自动挂载点
* Path：文件或路径
* Scope：不是由 Systemd 启动的外部进程
* Slice：进程组
* Snapshot：Systemd 快照，可以切回某个快照
* Socket：进程间通信的 socket
* Swap：swap 文件
* Timer：定时器

`systemctl list-units` 命令可以查看当前系统的所有 Unit

```bash
# 列出正在运行的 Unit
systemctl list-units

# 列出所有Unit，包括没有找到配置文件的或者启动失败的
systemctl list-units --all

# 列出所有没有运行的 Unit
systemctl list-units --all --state=inactive

# 列出所有加载失败的 Unit
systemctl list-units --failed

# 列出所有正在运行的、类型为 service 的 Unit
systemctl list-units --type=service
```

### Unit 状态查看

`systemctl status` 命令用于查看系统状态和单个 Unit 的状态

```bash
# 显示系统状态
systemctl status

# 显示单个 Unit 的状态
sysystemctl status sshd.service

# 显示远程主机的某个 Unit 的状态
systemctl -H root@rhel7.example.com status sshd.service
```

除了 status 命令，systemctl 还提供了三个查询状态的简单方法，主要供脚本内部的判断语句使用

```bash
# 显示某个 Unit 是否正在运行
systemctl is-active sshd.service

# 显示某个 Unit 是否处于启动失败状态
systemctl is-failed sshd.service

# 显示某个 Unit 服务是否建立了启动链接
systemctl is-enabled sshd.service
```

### Unit 管理

以下命令用来启动和停止 Unit（主要是 service）

```bash
# 启动一个服务
sudo systemctl start sshd.service

# 停止一个服务
sudo systemctl stop sshd.service

# 重启一个服务
sudo systemctl restart sshd.service

# 杀死一个服务的所有子进程
sudo systemctl kill sshd.service

# 重新加载一个服务的配置文件
sudo systemctl reload sshd.service

# 重载所有修改过的配置文件
sudo systemctl daemon-reload

# 显示某个 Unit 的所有底层参数
systemctl show sshd.service

# 显示某个 Unit 的指定属性的值
systemctl show -p CPUShares sshd.service

# 设置某个 Unit 的指定属性
sudo systemctl set-property sshd.service CPUShares=500
```

### Unit 依赖关系查看

Unit 之间可以存在依赖关系：如 A 依赖于 B，就意味着 Systemd 在启动 A 的时候，会先去将 B 启动

`systemctl list-dependencies` 命令可以列出一个 Unit 的所有依赖

```bash
systemctl list-dependencies sshd.service
```

### Unit 配置文件

每个 Unit 都有一个配置文件，用来告诉 Systemd 怎么启动这个 Unit

Systemd 默认从目录 `/etc/systemd/system/` 读取配置文件。但是里面存放的大部分文件都是符号链接，指向目录 `/usr/lib/systemd/system/` 中的文件。

`systemctl enable` 和 `systemctl disable` 命令用于设置和撤销开机启动（其实就是在下面两个目录之间建立或删除符号链）

```bash
sudo systemctl enable sshd.service

# 等同于
sudo ln -s '/usr/lib/systemd/system/sshd.service' '/etc/systemd/system/multi-user.target.wants/sshd.service'

sudo systemctl disable sshd.service

# 等同于
sudo rm '/etc/systemd/system/multi-user.target.wants/sshd.service'
```

> 配置文件的后缀名，是该 Unit 的种类，比如 sshd.socket
> 如果省略，Systemd 默认后缀名为 `.service`，所以 sshd 会被理解成 sshd.service

### Unit 配置文件的状态

`systemctl list-unit-files` 命令用于列出所有配置文件

```bash
# 列出所有配置文件
systemctl list-unit-files

# 列出指定类型的配置文件
systemctl list-unit-files --type=service
```

每个配置文件的状态，一共有四种:

* enabled：已建立启动链接
* disabled：没建立启动链接
* static：该配置文件没有 [Install] 部分（无法执行），只能作为其他配置文件的依赖
* masked：该配置文件被禁止建立启动链接

> 注意: 从配置文件的状态无法判断该 Unit 是否正在运行。必须执行前面提到的 `systemctl status` 命令

一旦修改配置文件，就要让 Systemd 重新加载配置文件，然后重新启动，否则修改不会生效

```bash
sudo systemctl daemon-reload
sudo systemctl restart sshd.service
```

### Unit 配置文件的格式

详见 [Unit 配置文件的格式](./Systemd配置文件.md)

## Unit Target

启动计算机时，需要启动大量的 Unit。如果每一次启动，都要一一写明本次启动需要哪些 Unit，显然非常不方便。Target 就是 Systemd 的解决方案。

简单来说 Target 就是一个 Unit 组，包含若干相关的 Unit 。在启动某个 Target 时，Systemd 就会启动里面所有的 Unit。从这个意义上说，Target 类似于"状态点"，启动某个 Target 就相当于启动到某个状态。

Target 的作用和传统的 init 启动模式里的 RunLevel 的概念很类似。不同的是，RunLevel 是互斥的，不可能多个 RunLevel 同时启动，但是多个 Target 可以同时启动。

```bash
# 查看当前系统的所有 Target
systemctl list-unit-files --type=target

# 查看一个 Target 包含的所有 Unit
systemctl list-dependencies multi-user.target

# 查看启动时的默认 Target
systemctl get-default

# 设置启动时的默认 Target
sudo systemctl set-default multi-user.target

# 切换 Target 时，默认不关闭前一个 Target 启动的进程，
# systemctl isolate 命令改变这种行为，
# 关闭前一个 Target 里面所有不属于后一个 Target 的进程
sudo systemctl isolate multi-user.target
```

Target 与 传统 RunLevel 的对应关系如下:

|runlevel|target 名|符号链接|
|---|---|---|
|Runlevel 0|runlevel0.target|poweroff.target|
|Runlevel 1|runlevel1.target|rescue.target|
|Runlevel 2|runlevel2.target|multi-user.target|
|Runlevel 3|runlevel3.target|multi-user.target|
|Runlevel 4|runlevel4.target|multi-user.target|
|Runlevel 5|runlevel5.target|graphical.target|
|Runlevel 6|runlevel6.target|reboot.target|

它与 init 的主要差别如下:

* 默认的 RunLevel（在 `/etc/inittab` 中）被默认的 Target 取代，位置是 `/etc/systemd/system/default.target`，通常符号链接到 graphical.target（图形界面）或者 multi-user.target（多用户命令行）
* 启动脚本的位置，init 是 `/etc/init.d` 目录，符号链接到不同的 RunLevel 目录 （比如/etc/rc3.d、/etc/rc5.d等），systemd 则存放在 `/lib/systemd/system和/etc/systemd/system` 目录
* 配置文件的位置，init 的配置文件是 `/etc/inittab`，各种服务的配置文件存放在 `/etc/sysconfig` 目录。systemd 的配置文件主要存放在 `/lib/systemd` 目录，在 `/etc/systemd` 目录里面的修改可以覆盖原始设置

## 日志管理

Systemd 统一管理所有 Unit 的启动日志。可以只用 journalctl 一个命令，查看所有日志（内核日志和应用日志）。日志的配置文件是 `/etc/systemd/journald.conf`。

```bash
# 查看所有日志（默认情况下 ，只保存本次启动的日志）
sudo journalctl

# 查看内核日志（不显示应用日志）
sudo journalctl -k

# 查看系统本次启动的日志
sudo journalctl -b
sudo journalctl -b -0

# 查看上一次启动的日志（需更改设置）
sudo journalctl -b -1

# 查看指定时间的日志
sudo journalctl --since="2012-10-30 18:17:16"
sudo journalctl --since "20 min ago"
sudo journalctl --since yesterday
sudo journalctl --since "2015-01-10" --until "2015-01-11 03:00"
sudo journalctl --since 09:00 --until "1 hour ago"

# 显示尾部的最新10行日志
sudo journalctl -n

# 显示尾部指定行数的日志
sudo journalctl -n 20

# 实时滚动显示最新日志
sudo journalctl -f

# 查看指定服务的日志
sudo journalctl /usr/lib/systemd/systemd

# 查看指定进程的日志
sudo journalctl _PID=1

# 查看某个路径的脚本的日志
sudo journalctl /usr/bin/bash

# 查看指定用户的日志
sudo journalctl _UID=33 --since today

# 查看某个 Unit 的日志
sudo journalctl -u nginx.service
sudo journalctl -u nginx.service --since today

# 实时滚动显示某个 Unit 的最新日志
sudo journalctl -u nginx.service -f

# 合并显示多个 Unit 的日志
journalctl -u nginx.service -u php-fpm.service --since today

# 查看指定优先级（及其以上级别）的日志，共有8级
# 0: emerg
# 1: alert
# 2: crit
# 3: err
# 4: warning
# 5: notice
# 6: info
# 7: debug
sudo journalctl -p err -b

# 日志默认分页输出，--no-pager 改为正常的标准输出
sudo journalctl --no-pager

# 以 JSON 格式（单行）输出
sudo journalctl -b -u nginx.service -o json

# 以 JSON 格式（多行）输出，可读性更好
sudo journalctl -b -u nginx.serviceqq
 -o json-pretty

# 显示日志占据的硬盘空间
sudo journalctl --disk-usage

# 指定日志文件占据的最大空间
sudo journalctl --vacuum-size=1G

# 指定日志文件保存多久
sudo journalctl --vacuum-time=1years
```
