# 利用JFR生成性能日志

## 打开JFR

JVM_OPT中添加如下参数：

```
-XX:+UnlockCommercialFeatures
-XX:+FlightRecorder
-Djavax.xml.parsers.SAXParserFactory=com.sun.org.apache.xerces.internal.jaxp.SAXParserFactoryImpl
```

##  启动JFR

登陆服务器，找到应用PID，执行命令：

```bash
jcmd $PID JFR.start name=abc,duration=120s
```

## Dump JFR

等待至少duration（本文设定120s）后，执行命令：

```bash
jcmd $PID JFR.dump name=abc,duration=120s filename=abc.jfr（注意，文件名必须为.jfr后缀）
```

## 检查JFR状态

执行命令：

```bash
jcmd $PID JFR.check name=abc,duration=120s
```

## 停止JFR

执行命令：

```bash
jcmd $PID JFR.stop name=abc,duration=120s
```

## JMC分析

切回开发机器，下载步骤3中生成的 abc.jfr，打开 jmc，导入 abc.jfr 即可进行可视化分析
