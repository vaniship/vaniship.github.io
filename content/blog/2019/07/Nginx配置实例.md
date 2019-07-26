# Nginx配置实例

## 调试输出

```
location /test {
  default_type text/html ;
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
    proxy_pass https://${subdomain}.aliyuncs.com;
  }
}1
```
