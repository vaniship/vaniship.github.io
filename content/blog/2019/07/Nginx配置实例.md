# Nginx配置实例

## 调试输出

```
location /test {
  default_type text/html;
  return 200  'test';
}
```

## 子目录映射到子域名的反向代理

```nginx
server {
  listen 8888;
  server_name oss.bitunion.cloud;

  location ~/[a-zA-Z0-9-_]*/.*$ {
    resolver 8.8.8.8;
    rewrite /([a-zA-Z0-9-_]*)(/.*) $2 break;
    proxy_pass https://$1.oss-cn-beijing.aliyuncs.com;
  }
}
```

## 子域名映射到子域名的反向代理

```nginx
server {
  listen 8888;
  server_name ~^(?<subdomain>.*)\.oss\.bitunion\.cloud$;

  location / {
    resolver 8.8.8.8;
    proxy_pass https://${subdomain}.aliyuncs.com;
  }
}1
```

## 关于 location 路径后的 `\`

### 对于 alias 和 proxy_pass 指令

没有对反斜杠做特殊处理，只是把匹配路径模式之后的路径直接拼接在 alias 或 proxy_pass 路径之后。

例如： 匹配模式是 /test, 请求路径是 /test123/455.txt，那么匹配路径模式之后的路径是 123/455.txt

如果：

* alias 路径是 /path/to/alias
* 那么将返回文件 /path/to/alias123/455.txt 的内容，找不到该文件则返回 404

如果：
* alias 路径是 /path/to/alias/
* 那么将返回文件 /path/to/alias/123/455.txt 的内容，找不到该文件则返回 404

`可以看出，虽然返回的文件路径不同，但其实两种情况的处理方式是一样的，并没有区别。`

### 对于 root 指令

都是将请求全路径拼接到 root 路径之后

例如： 匹配模式是 /test, 请求路径是 /test123/455.txt，即请求全路径是 /test123/455.txt

如果：

* root 路径是 /path/to/alias
* 那么将返回文件 /path/to/alias/test123/455.txt 的内容，找不到该文件则返回 404

如果：

* root 路径是 /path/to/alias/
* 那么将返回文件 /path/to/alias//test123/455.txt 的内容，找不到该文件则返回 404

`可以看出，返回文件和处理方式都是一样的。`

> 注意：返回文件在服务器上的路径并不完全相同，只是等效而已（多了一个`/`）
