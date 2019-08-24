# bash常用代码

## 获取当前脚本执行路径

```bash
#!/bin/sh
runPath=$(cd "$(dirname "$0")"; pwd)
echo $runPath
```

## 多行文本写入

```bash
cat>filename.txt<<EOF
balabala...
balabala...
balabala...
EOF
```

## 设置命令行提示符

```bash
export PS1=myprompt
```

## 创建指定大小的文件

```bash
fallocate -l 10M filename.txt
```

## Case

```bash
case "$1" in
  start)
    echo "start"
    ;;

  stop)
    echo "stop"
    ;;

  *)
    echo "Usage: run.sh {start|stop}"
    ;;

esac
```
