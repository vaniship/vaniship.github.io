# 用树莓派做nas服务器

## samba 服务

安装

```bash
sudo apt-get install samba samba-common-bin
```

配置

在 `/etc/samba/smb.conf` 中添加如下内容：

```ini
[MDisk] # Samba 目录名
    # 说明信息
    comment = Usb Storage
    # 可以访问的用户
    valid users = nas
    # 共享文件的路径
    path = /media/MDisk
    # 可被其他人看到资源名称（非内容）
    browseable = yes
    # 可写
    writable = yes
    # 新建文件的权限为 664
    create mask = 0664
    # 新建目录的权限为 775
    directory mask = 0775
```

配置账户密码，注意指定的用户，必须是 linux 已存在的用户

```
sudo smbpasswd -a $用户名
```

重启 samba 服务

```bash
sudo systemctl restart smbd
```

## exfat 支持问题

要支持 exfat 格式的磁盘，需要安装以下软件包：

```bash
sudo apt install fuse-utils exfat-fuse
```

## ntfs 支持

新版树莓派已内置 ntfs 读写驱动

## 磁盘自动挂载

### fstab

通过 fstab ，可以实现开起启动时自动挂载指定磁盘，但是设备弹出后再接入则不会自动挂载

在 `/etc/fstab` 中添加如下配置：

```ini
# nofail 表示，如果开启启动时找不到该设备，则忽略错误继续启动，如果不加该选项，则启动时会报错
UUID=$设备ID $挂载目录 $磁盘格式 defaults,auto,nofail,umask=000,users,rw 0 0
```

### udev

通过 udev ，可以实现当设备弹出、插入等操作时，自动执行指定操作

可以在 /ect/udev/rules.d 目录内创建文件： `99-udisks.rules`， 然后添加如下内容：

```ini
# 仅监测设备名匹配 sd* 的设备
KERNEL!="sd*", GOTO="media_by_label_auto_mount_end"
# 仅监测块设备
SUBSYSTEM!="block",GOTO="media_by_label_auto_mount_end"

# 通过 blkid 命令给环境变量赋值
IMPORT{program}="/sbin/blkid -o udev -p /dev/%k"
# 设备类型未知的跳过
ENV{ID_FS_TYPE}=="", GOTO="media_by_label_auto_mount_end"

# ID_FS_UUID 为指定值的设备添加时，执行指定命令
ACTION=="add", ENV{ID_FS_UUID}=="$设备ID", ENV{dir_name}="$挂载目录", RUN+="/usr/bin/systemd-mount --no-block --fsck=no -A --timeout-idle-sec=1800 --collect /dev/%k $env{dir_name}"

# 以上指令可以是多条，每个分区对应一条规则

LABEL="media_by_label_auto_mount_end"
```

使新添加的规则生效

```bash
sudo udevadm control --reload-rules && sudo udevadm trigger
```

### systemd-mount
