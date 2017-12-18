# 修改 RedHat 最大文件描述符数

## 修改背景

在 RedHat 上部署 Nexus 私有仓库时，Nexus 会在页面上提示警告，目前的文件描述符数过低，需要至少 65535 的警告。于是有了修改最大文件描述符数的需求。

## 修改方法

可以通过配置 /usr/lib/security/limits.conf 进行配置。

在 linux 系统中，limits.conf 文件实际是 Linux PAM（插入式认证模块，Pluggable Authentication Modules）中 pam_limits.so 的配置文件，而且只针对于单个会话。

limits.conf 的格式如下

```
username|@groupname type resource limit
```

* username|@groupname 设置需要被限制的用户名或组名。前面加@代表组名。也可以用通配符*来做所有用户的限制。
* type 有 soft，hard 和 -
    * soft 指当前系统生效的设置值。
    * hard 表明系统中所能设定的最大值。soft 的限制不能比 hard 限制高。
    * - 表明同时设置 soft 和 hard 的值。
* resource 设置被限制的资源
    * core 限制内核文件的大小
    * date 最大数据大小
    * fsize 最大文件大小
    * memlock 最大锁定内存地址空间
    * nofile 打开文件的最大数目(文件描述符数)
    * rss 最大持久设置大小
    * stack 最大栈大小
    * cpu 以分钟为单位的最多 CPU 时间
    * nproc 进程的最大数目
    * as 地址空间限制
    * maxlogins 此用户允许登录的最大数目

## 注意

因为该设置是针对用户会话的，所以要生效，不仅需要重新启动目标程序（例如 Nexus），还需要先重新登录用户，不需要重启系统。

可以通过如下命令查询配置是否生效：

```bash
ulimit -a
```
