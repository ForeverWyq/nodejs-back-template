# nodejs-back-template

简体中文 | [English](./README.en.md)

#### 介绍
nodejs-back-template是一个可快速搭建nodejs接口服务的一个极简框架，由webpack进行压缩打包，封装了websocket、httpserve、file操作、mysql访问等方法，有完整的接口路由系统。

#### 安装教程

npm install

#### 使用说明

1. npm run watch 可以实时监听文件变化动态更新dist/main.js环境为development
2. npm run serve 运行dist/main.js
3. npm run build 打包至dist/main.js环境为production
4. npm run lint 检测并修复eslint问题

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  server封装
2.  ws封装
3.  单独的入口main.js
4.  层层传递的socketList 接口调用时可主动向特定用户发送消息
5.  统一的路由管理
6.  统一的请求参数读取

#### License

MIT License

Copyright (c) 2023 梓齐

#### 软件架构

软件架构说明

```md
|-- nodejs-template-back
    |-- src
    |   |-- main.js 主函数
    |   |-- serve.js 服务封装
    |   |-- common 常量和公共方法
    |   |   |-- BaseResponse.js 请求返回封装
    |   |   |-- CONSTANT
    |   |       |-- index.js 常量主入口，自动化导入所有模块
    |   |       |-- modules
    |   |           |-- RESPONSE.js 请求code常量
    |   |           |-- WHITEURL.js 接口白名单
    |   |-- config
    |   |   |-- config.development.js 开发环境设置
    |   |   |-- config.js 公用环境设置
    |   |   |-- config.production.js 生产环境设置
    |   |   |-- index.js 主入口根据环境导入config
    |   |-- controller
    |   |   |-- user.js
    |   |-- dao
    |   |   |-- db.js
    |   |   |-- modules
    |   |       |-- user.js
    |   |-- service
    |   |   |-- user.js
    |   |-- utils
    |   |   |-- file.js 文件操作
    |   |   |-- lock.js 锁
    |   |   |-- router.js 路由类
    |   |-- webSocket
    |       |-- index.js
    |-- .eslintrc.js
    |-- webpack.config.js webpack配置

```
