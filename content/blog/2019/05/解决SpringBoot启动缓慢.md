# 解决 Spring Boot 启动缓慢

MacOS 系统，发现在公司启动 Spring Boot 应用时都很快，但是到家启动时总是会卡很长时间才能启动，非常影响效率。

找了下原因，详情可以看一下[原文](https://thoeni.io/post/macos-sierra-java/)。简单来说就是，应用启动时有些框架或者日志组件，尤其是spring boot，会直接或间接地多次调用：``java.net.InetAddress.getLocalHost()``，而这个调用在新版的 MacOs 中可能会耗时很久。

解决办法有两种：

1. 把本机的 hostname 添加到 hosts 中，例如: 127.0.0.1 localhost MyMac2
2. 执行 scutil --set HostName "localhost"

```sh
scutil --set HostName "localhost"
```
