# vue-echarts-nestjs-websocket

> 为了测试echarts初始化时会出现异常写的小demo，顺带学习了下后端websocket的写法
>
> 前端页面流程：
>
> 1、发起一次http请求获取初始化echarts的数据（会存在有数据和没数据的情况）
>
> 2、初始化websocket
>
> 后端：
>
> 1、nestjs+ws实现的websocket
>
> 2、这里要使用send方法给客户端回复消息，直接return会出现奇怪的bug，自动给字符串加引号
>
> 3、客户端与服务端交互需要传event参数（{ event: 'heartbeat', data: 'ping' }），否则监听不到，不知道是ws还是nestjs做的设置，未发现怎么监听所有数据的方法，有大佬知道麻烦指点下我

### 前端：echart-test

> npm i
>
> npm run serve

### 后端:nestjs-ws

>  npm i
>
> npm run start:dev