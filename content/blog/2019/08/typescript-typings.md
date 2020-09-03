# Typescript 类型定义文件配置

## 安装现有类型定义文件

```bash
npm i -D @types/package-name
```

## 模块导出为一个函数

```ts
declare module "my_module" {
  function my_module(): string;
  export = my_module;
}
```
