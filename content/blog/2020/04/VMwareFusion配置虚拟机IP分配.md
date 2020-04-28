# VMwareFusion配置虚拟机IP分配

## 修改

```bash
sudo vi /Library/Preferences/VMware\ Fusion/vmnet8/dhcpd.conf

host centos.01 {

hardware ethernet 00:50:56:3C:30:4B;

fixed-address 192.168.187.101;

}

```

```bash
sudo vi /Library/Preferences/VMware\ Fusion/vmnet8/nat.conf
```

## 重启虚拟机网络服务

```bash
sudo /Applications/VMware\ Fusion.app/Contents/Library/vmnet-cli --stop
sudo /Applications/VMware\ Fusion.app/Contents/Library/vmnet-cli --start
```
