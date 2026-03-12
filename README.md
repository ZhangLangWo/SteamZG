# SteamZG 二维码链接自动解码

## 功能描述

这是一个 Tampermonkey 脚本，用于自动解码 xj.steamzg.com 和 acfb.top 网站上的二维码链接（data-qr-url 属性），并显示明文链接。

## 主要功能

- 自动检测页面上的 data-qr-url 属性
- 解码 Base64 编码的链接
- 显示解码后的明文链接
- 提供复制链接功能
- 支持动态加载的内容（如下拉加载）
- 链接有效性检查
- 友好的错误提示

## 安装方法

1. 安装 Tampermonkey 浏览器扩展
2. 访问脚本页面： https://greasyfork.org/zh-CN/scripts/565007 安装脚本
3. 点击「添加到 Tampermonkey」按钮，确认安装

## 版本历史

- v1.1: 优化性能、代码结构和用户体验
- v1.0: 初始版本

## 许可证

私有
