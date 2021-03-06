## one-icon

one-icon 是由阿里数据技术及产品部新能源前端团队开发的辅助 ifont 使用的工具。

[![npm version](https://badge.fury.io/js/one-icon.png)](https://badge.fury.io/js/one-icon)
[![npm downloads](https://img.shields.io/npm/dt/one-icon.svg?style=flat-square)](https://www.npmjs.com/package/one-icon)
[![Gitter](https://badges.gitter.im/jasonHzq/one-icon.svg)](https://gitter.im/jasonHzq/one-icon?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

one-icon 提供如下功能：

1. 自动检测更新并一键生成项目中需要的最新 css、js 代码
2. 采用了 Iconfont 的 font-class 和 symbol 方案，同时支持单色和多色 icon；
3. 提供可视化展示界面，一键复制代码。

### 安装

下载安装 one-icon 工具:

yarn:

```sh
yarn global add one-icon
```

npm:

```sh
npm add -g one-icon
```

安装 one-icon React 组件

yarn:

```sh
yarn add one-icon
```

npm:

```sh
npm i -S one-icon
```

### 使用

在项目根目录下建立`oneicon-config.json`文件，配置需要的项目参数：

```
// 示例代码
{
  "projectList": [
    {
      "id": "11111",  // Iconfont中的项目id列表
      "cssOutputPath": "src/styles/iconfont.scss", // 输出css文件的目录
      "iconCode": "<i class='iconfont icon-{fontName} {extraClasses}'></i>", // 展示界面复制Iconfont的模板，其中{fontName}表示字体类名，{extraClasses}表示样式类名，会自动替换
      "classNameList": ["cssClassName"] // 额外添加的CSS样式类
    },
    {
      "id": "222",
      "jsOutputPath": "src/styles/qbi-svg-icon.js", // 输出js文件的目录
      "svgIconCode": "<svg class='svg-icon {extraClasses}' aria-hidden='true'><use xlink:href='#icon-{fontName}'></use></svg>",  // 展示界面复制SVG的模板
      "svgClassNameList": ["svgClassName"]  // 额外添加的SVG样式类
    },
    ,
    {
      "id": "333",
      "jsOutputPath": "src/styles/fbi-svg-icon.js", // 输出js文件的目录
      "uniqueId": "fbi", // 多项目svg id重合时加上的id
      "svgIconCode": "<svg class='svg-icon {extraClasses}' aria-hidden='true'><use xlink:href='#icon-fbi-{fontName}'></use></svg>",  // 展示界面复制SVG的模板，需要加上uniqueId
      "svgClassNameList": ["svgClassName"]  // 额外添加的SVG样式类
    }
  ]
}
```

在终端运行`icon`开启服务，one-icon 将自动生成相关的 css、js 代码到相应的文件夹中。

此时打开 127.0.0.1:3000 可以看到可视化的界面，界面上提供复制代码、自动检测、自动更新的功能。

代码每隔 10 分钟检查一次是否是最新的样式代码，若不是则会自动更新，重新下载样式文件。

### 常见问题

- 运行 `npm run icon` 出错

请仔细阅读报错信息，很有可能是配置出错；请确保你的 projectId 正确，你的路径存在。

- 服务启动之后，代码并没有自动更新？

由于更新代码需要获取登录授权，而自动打开的授权弹窗可能由于你的浏览器设置而被阻止；此时你需要点击展示页面的【手动更新】按钮进行更新。

- 我手动更新了，项目中还是没生效？

请确保项目中引入了生成的 css、js 文件，并确认项目中的代码是否需要手动刷新之后才生效。
