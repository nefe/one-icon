## one-icon

one-Icon 是由阿里数据技术及产品部新能源前端团队开发的辅助 Iconfont 使用的工具。

它提供如下功能：

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
  "projectIdList": ['12345', '23456'],    // Iconfont中的项目id列表
  "cssOutputPath": "src/styles/oneicon.scss",  // 输出css文件的目录
  "jsOutputPath": "src/styles/oneicon.js"      // 输出js文件的目录
  "classNameList": ["dpicon"]    // Icon需要自带的样式
}
```

在终端运行`icon`开启服务，one-icon 将自动生成相关的 css、js 代码到相应的文件夹中。

此时打开 127.0.0.1:3000 可以看到可视化的界面，界面上提供复制代码、自动检测、自动更新的功能。

代码每隔 10 分钟检查一次是否是最新的样式代码，若不是则会自动更新，重新下载样式文件。

### 使用 one-icon React 组件

1.  在项目中引入生成的 css、js 文件

2.  导入 Icon 组件`import { Icon } from 'one-icon';`

3.  若是单色 Icon，引入方式为`<Icon type="one-icon icon-default" />`

4.  若是多色 Icon，引入方式为`<Icon colorful type="one-icon icon-default" />`

### 常见问题

- 运行 `icon` 出错

请仔细阅读报错信息，很有可能是配置出错；请确保你的 projectId 正确，你的路径存在。

- 服务启动之后，代码并没有自动更新？

由于更新代码需要获取登录授权，而自动打开的授权弹窗可能由于你的浏览器设置而被阻止；此时你需要点击展示页面的【手动更新】按钮进行更新。

- 我手动更新了，项目中还是没生效？

请确保项目中引入了生成的 css、js 文件，并确认项目中的代码是否需要手动刷新之后才生效。
