<!--
 * @Author: lujiangbo knight_lujb@163.com
 * @Date: 2026-06-29 07:40:34
 * @LastEditors: lujiangbo knight_lujb@163.com
 * @LastEditTime: 2026-06-29 07:44:09
 * @Description:
-->

### 这是一个 nestjs + langchain + langgraph 的 AI 项目 demo

### 如果遇到 localhost 访问本地报错但是 127.0.0.1 可以访问是因为本地解析域名冲突的问题，需要修改 hosts 中的文件

这行代码需要注释或者删除
** ## ::1 localhost **

## 如果 node 项目报错：ReferenceError: crypto is not defined

# 需要在入口页面加入如下代码

Here’s the code snippet we used:
`import { webcrypto } from 'node:crypto';

if (!(globalThis as any).crypto) {
(globalThis as any).crypto = webcrypto;
}
`
