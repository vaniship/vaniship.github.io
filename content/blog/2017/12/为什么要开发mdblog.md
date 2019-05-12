# 为什么要开发 MDBlog ？

## 很可能它并不适合你

首先，我想这个 MDBlog 很可能并不适合你...

* 它没有用户系统
* 它没有绚丽的皮肤（虽然理论上讲，你也可以自己做出你想要的皮肤，但成本还是很高的）
* 它不能自动生成按时间排序的博文列表，菜单和列表内容都需要你自己来写
* 为了使用它，你要学习 Markdown 的语法
* 它没有方便的全文搜索（需要借助其他工具来完成）
* 它只支持现代浏览器

## MDBlog 特性

如果你觉得上面那些并不是你最关心的，我们来看看 MDBlog 可以提供什么：

* 以文件作为存储单元，以 Markdown 为存储格式
* 无需数据库支持
* 完全自定义的文章管理方式（其实就是没有管理）
* 纯静态无需编译，直接放到 Git Page 上即可
* 多种编程语言代码高亮
* 现有插件支持绘制流程图、类图、甘特图等 mermaid 支持的图。
* 现有插件支持绘制文件夹结构树状图
* 现有插件支持绘制人员组织结构图
* 插件化设计，可以通过扩展实现更多功能

如果上面的功能描述很多你都不能理解，很可能是因为它的使用场景和您很不匹配。

## 一些扩展功能的示例

下面是一些示例，看看这些是不是您所需要的

### 流程图

```plugin!mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

### 时序图

```plugin!mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail...
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
```

### 甘特图

```plugin!mermaid
gantt
dateFormat  YYYY-MM-DD
title Adding GANTT diagram to mermaid

section A section
Completed task            :done,    des1, 2014-01-06,2014-01-08
Active task               :active,  des2, 2014-01-09, 3d
Future task               :         des3, after des2, 5d
Future task2               :         des4, after des3, 5d
```

### 类图

```plugin!mermaid
classDiagram
Class01 <|-- AveryLongClass : Cool
Class03 *-- Class04
Class05 o-- Class06
Class07 .. Class08
Class09 --> C2 : Where am i?
Class09 --* C3
Class09 --|> Class07
Class07 : equals()
Class07 : Object[] elementData
Class01 : size()
Class01 : int chimp
Class01 : int gorilla
Class08 <--> C2: Cool label
```

### 文件结构图

```js plugin!dirtree
[{
  "text": "src",
  "type": "folder",
  "children": [
    {
      "type": "js",
      "text": "test.js"
    }
  ]
}]
```

### 组织关系图

```js plugin!orgchart
{
  'name': 'Lao Lao',
  'title': 'general manager',
  'children': [
    { 'name': 'Bo Miao', 'title': 'department manager', 'collapsed': true,
      'children': [
        { 'name': 'Li Jing', 'title': 'senior engineer', 'className': 'slide-up' },
        { 'name': 'Li Xin', 'title': 'senior engineer', 'collapsed': true, 'className': 'slide-up',
          'children': [
            { 'name': 'To To', 'title': 'engineer', 'className': 'slide-up' },
            { 'name': 'Fei Fei', 'title': 'engineer', 'className': 'slide-up' },
            { 'name': 'Xuan Xuan', 'title': 'engineer', 'className': 'slide-up' }
          ]
        }
      ]
    },
    { 'name': 'Su Miao', 'title': 'department manager',
      'children': [
        { 'name': 'Pang Pang', 'title': 'senior engineer' },
        { 'name': 'Hei Hei', 'title': 'senior engineer', 'collapsed': true,
          'children': [
            { 'name': 'Xiang Xiang', 'title': 'UE engineer', 'className': 'slide-up' },
            { 'name': 'Dan Dan', 'title': 'engineer', 'className': 'slide-up' },
            { 'name': 'Zai Zai', 'title': 'engineer', 'className': 'slide-up' }
          ]
        }
      ]
    }
  ]
}
```

### 思维导图

```js plugin!mindmap?height=480
{
  text: 'MDBlog',
  children: [
    {
      text: '特性',
      children: [
        { text: 'Markdown 为存储格式' },
        { text: '无需数据库支持' },
        { text: '无需编译，可直接发布Git Page' },
        { text: '编程语言代码高亮' },
        { text: '绘图支持' },
        { text: '插件化设计，易于扩展' }
      ]
    },
    {
      text: '功能',
      children: [
        { text: '流程图' },
        { text: '时序图' },
        { text: '甘特图' },
        { text: '类图' },
        { text: '文件结构图' },
        { text: '组织关系图' },
        { text: '思维导图' }
      ]
    },
    {
      text: '知识管理工具的演进',
      children: [
        { text: '仅做收集' },
        { text: '编辑创作' },
        { text: '自建维基' },
        { text: 'Markdown' },
        { text: '静态博客' },
        { text: '前端渲染' },
        { text: '返璞归真' }
      ]
    }
  ]
}
```

## 知识管理工具的演进

我也是算是试用过少知识记录工具。

### 仅做收集

最早的时候，基本就是收集，那时用的还是 Windows 系统，用了很长一段时间的``网海拾贝``，可以很好的满足我收集资料的需求。从网页上抓取资料非常方便。但是后来很久都没有再更新过。

之后出现了更强大的印象笔记，可能是使用习惯不同，也收费，一直都没用起来。

### 编辑创作

慢慢仅仅收集就不够用了，还要可以编辑创作，一般最常用的 Word 倒是可以满足编辑需求，但是对于程序原来说，页面排版和代码高亮都很不方便，总是在调整格式上花费太多时间。另外一个个独立的 Word 文件很不方便管理，启动速度也慢。

接触了维基系统以后，觉得这可能正是我想要的，可以专注于内容，不用费心考虑格式和代码高亮，本地浏览和编辑都没问题。

期间也试用过各种公开博客，总觉受制于人，备份不方便，离线无法浏览和编辑，功能扩展也不方便，也少有支持维基语法的，便放弃了。

### 自建维基

于是开始关注可以自行搭建的维基系统。

为了便于备份和移植，功能强大又不依赖数据库的 dokuwiki 成了我的最佳选择。它非常小巧，是一个用 php 实现的网站应用，安装配置都很容易。采用纯文本文件的形式管理文章，不用配置数据库，但支持用户及权限控制系统，支持插件，功能非常丰富。备份也很容易，只要将整个应用目录备份即可。

### Markdown

其实 Dokuwiki 已经非常好用了。但是它用的并不是主流的 Markdown 语法，虽然也可以利用 Markdown 插件来在一定程度上兼容 Markdown 语法，但是总有些小问题。很多时候还需要两种维基语法混写。

无奈至下只能继续寻找更好的方案。

### 静态博客

后来发现了静态博客，可以将 Markdown 格式的文档编译为标准的 Html，这样就可以直接部署到静态服务器上。一段时间里，用 Git Page 搭建个人博客变成了一种潮流。试用过几个产品后，觉得 hugo 不错，跨平台、速度快，几乎准备将以前的资料都迁移过来了。

但是每次发布都需要先编译，还是麻烦。

### 前端渲染

终于在 GitHub 上找到了 MDWiki，虽然已经久未更新，但是其提供的功能正是我想要的。

* 正统的 Markdown 语法
* 纯前端渲染，仅需部署到静态服务器即可正常工作
* 无需数据库支持
* 支持扩展
* 备份方便（备份目录即可）

因为 MDWiki 没有服务器，所以诸如用户系统、权限控制的功能统统没有。

我觉得 MDWiki 的设计思想是很棒的，但是无法满足我的日常需求。主要就是绘图能力不足，代码高亮有些小问题。

用 MDWiki 来做个人知识分享博客还是不够用理想，但是它轻巧的设计非常适合做产品文档。

### 返璞归真

再后来，发现有人直接使用 GitHub 的 Issue 模块做博客。具体操作是：

* 创建一个公开仓库
* 创建博文，就是创建一个 Issue

就是这么简单。

但是这个思路真的很巧妙：

* Issue 本来就是按时间自动倒序排序，正好符合博客的形式。
* 创建 Issue 后，其他人可以对问题进行讨论，正好就是博客的评论功能。
* 可以评论的用户都是 GitHub 的用户，大都是程序员，一定程度上对用户进行了过滤。

当然存在问题：

* Issue 任何人都可以创建，无法管理。
* Issue 只能关闭，无法删除。
* 博客不易被搜索引擎捕捉到。

## 决定造轮子

分析总结自己的需求，大概如下：

* 有良好的 Markdown 语法支持
* 有良好语法高亮支持
* 有良好绘图支持
* 不依赖服务器、不依赖数据库
* 便于扩展，主要是绘图扩展
* 支持本地浏览，最好支持从文件系统直接浏览
* 便于备份
* 支持部署到 Git Page

最终我还是没有找符合需求的知识管理工具，于是便造了 MDBlog 这个轮子。


