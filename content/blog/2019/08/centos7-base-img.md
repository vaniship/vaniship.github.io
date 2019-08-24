# centos7-base-img

```bash
# === 更新软件包 ===
sudo yum update

# === 创建用户 ===
sudo useradd admin
sudo passwd admin

# === 配置 sudo 权限 ===
sudo vi /etc/sudoers

# === 配置 ssh 登录方式 ===
sudo vi /etc/ssh/sshd_config
sudo systemctl restart sshd

# === 安装基础工具 ===
sudo yum install -y bzip2 wget tmux telnet rlwrap

# === 性能工具 ===
sudo yum install -y lsof perf sysstat dstat

# === 安装 IUS 源 ===
sudo su -
curl https://setup.ius.io | sh
exit

# === 安装 git ===
sudo yum install -y git2u

# === 安装 jdk ===
sudo rpm -ivh jdk-*.rpm

# === 安装 nodejs ===
# 更多参考 https://github.com/nodejs/help/wiki/Installation
export NODE_VERSION=v8.16.0
wget https://nodejs.org/dist/latest-v8.x/node-$NODE_VERSION-linux-x64.tar.xz
sudo mkdir /usr/local/lib/nodejs
sudo tar -xJvf node-$NODE_VERSION-linux-x64.tar.xz -C /usr/local/lib/nodejs
sudo mv /usr/local/lib/nodejs/node-$NODE_VERSION-linux-x64 /usr/local/lib/nodejs/node-$NODE_VERSION
sudo ln -s /usr/local/lib/nodejs/node-$NODE_VERSION/bin/node /usr/bin/node
sudo ln -s /usr/local/lib/nodejs/node-$NODE_VERSION/bin/npm /usr/bin/npm
sudo ln -s /usr/local/lib/nodejs/node-$NODE_VERSION/bin/npx /usr/bin/npx

# === 安装 nginx ===
# 更多参考 https://nginx.org/en/linux_packages.html#stable
cat>/etc/yum.repos.d/nginx.repo<<EOF
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/centos/7/basearch/
gpgcheck=0
enabled=1
EOF
sudo yum install -y nginx
# --- 配置 nginx 相关的 SELinux ---
sudo setsebool -P httpd_can_network_connect 1
sudo systemctl start nginx
sudo systemctl enable nginx

# === 安装 https 证书管理工具 ===
sudo yum install -y python2-certbot-nginx
# sudo pip install --upgrade --force-reinstall 'requests==2.6.0' urllib3 # 如果报错，可尝试执行此命令
# sudo certbot --nginx -d domain.com # 使用方法

# === 安装 jenkins ===
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
sudo yum install -y jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
# --- Jenkins 常用配置路径 ---
# /etc/init.d/jenkins
# /etc/sysconfig/jenkins
# /etc/passwd
# 允许前端执行 js ，可在页面控制台执行下面命令
# System.setProperty("hudson.model.DirectoryBrowserSupport.CSP", "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'")
# System.getProperty("hudson.model.DirectoryBrowserSupport.CSP")

# === 安装 mysql ===
sudo rpm -ivh http://repo.mysql.com/mysql-community-release-el7-5.noarch.rpm
sudo yum install mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld
# --- 开放防火墙端口(如需要) ---
# firewall-cmd –add-port=3306/tcp –permanent
# 重启防火墙
# service firewalld restart
# --- mysql 安全配置 ---
mysql_secure_installation
# 允许远程登录
mysql -uroot -p -Dmysql -e "grant all privileges  on *.* to root@'%' identified by '${password}';flush privileges;"
# --- 修改最大连接数 ---
# 修改 /etc/my.cnf, 在 mysqld 区段下添加
# max_connections=2000
# 在一些机器上可能会出现设置最大连接数失效的问题，最大连接数为 214，可添做如下操作：
# 修改 /usr/lib/systemd/system/mysqld.service 文件，解除系统对 mysql 进程的限制，在文件 [Service] 段添加如下配置：
# LimitNOFILE=65535
# LimitNPROC=65535
# 修改后刷新配置，重启 mysql 即可：
# sudo systemctl daemon-reload
# sudo systemctl restart mysqld.service

# === 扩展磁盘空间 ===
sudo growpart /dev/nvme0n1 1
sudo xfs_growfs /
```
