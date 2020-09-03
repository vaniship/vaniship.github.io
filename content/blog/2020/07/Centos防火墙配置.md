# Centos防火墙配置

## 查看防火墙状态

```bash
sudo systemctl status firewalld.service
```

## 查看防火墙规则

```bash
sudo firewall-cmd --list-all
```

## 添加防火墙规则

```bash
sudo firewall-cmd --permanent --add-port=80/tcp
```

## 重启防火墙

新规则生效，需要重启防火墙服务

```bash
sudo systemctl restart firewalld.service
```
