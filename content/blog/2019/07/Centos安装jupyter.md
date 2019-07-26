# Centos 安装配置 jupyter

## 安装 pip

```bash
sudo yum install python-pip
```

## 安装 virtualenv

```bash
sudo pip install virtualenv
```

## 安装 Python3

```bash
# 安装软件源
sudo yum install epel-release

# 安装 Python 3.6
sudo yum install python36

```

## 安装 jupyter

```bash
# 创建目录
mkdir omy-jupyter-notebook

# 进入目录
cd omy-jupyter-notebook

# 创建工作用虚拟环境
virtualenv --system-site-packages -p python3.6 kernels/py3-my-workbench
# 进入工作用虚拟环境
source kernels/py3-my-workbench/bin/activate
# 安装 ipykernel
pip install ipykernel
# 注册工作用虚拟环境
python -m ipykernel install --user --name=py3-my-workbench
# 安装常用库
pip install redis pandas numpy matplotlib pymysql ipywidgets fastprogress
# 退出工作用虚拟环境
deactivate

# 创建运行时虚拟环境
virtualenv --system-site-packages -p python3.6 python-runtime

# 进入运行时虚拟环境
source python-runtime/bin/activate

# 安装 jupyter
pip install jupyter

# 安装扩展
pip install jupyter_contrib_nbextensions
jupyter contrib nbextension install --user
# 安装扩展配置器
pip install jupyter_nbextensions_configurator
# 启用扩展
jupyter nbextensions_configurator enable --user

# 初始化配置文件
jupyter notebook --generate-config

# 设置密码
jupyter notebook password

# 生成启动脚本
cat>start.sh<<EOF
#!/bin/sh

runPath=$(cd "$(dirname "$0")"; pwd)
cd ${runPath}

source ./python-runtime/bin/activate
mkdir -p my-data
nohup jupyter notebook --ip 0.0.0.0 --no-browser --notebook-dir ./my-data &
EOF

# 未启动脚本添加执行权限
chmod +x ./start.sh

# 启动 jupyter
./start.sh
```

## 配置中文字体

```bash
sudo yum install -y mkfontscale fontconfig
sudo mkdir -p /usr/share/fonts/chinese
# 将字体文件拷贝到 /usr/share/fonts/chinese
cd /usr/share/fonts/chinese
sudo mkfontdir
sudo mkfontscale
sudo fc-cache
# 清空 matplotlib 字体缓存，一定要清空，否则不生效
rm .cache/matplotlib/fontlist*.json
```
