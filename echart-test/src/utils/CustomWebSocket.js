export default class CustomWebSocket {
    sum = 0;
    params = null;
    status = 'open';
    constructor(path, params = { readMsg: null, err: null }) {
        this.path = path;
        this.params = params;
        this.connect();
    }

    connect() {
        this.ws = new WebSocket(this.path);
        this.ws.onopen = () => {
            this.status = 'open';
            //this.sum = 0
            console.log(`连接成功`);

            // 检查心跳
            this.heartCheck();

            // 获取返回的信息
            this.ws.onmessage = e => {
                const tmpData = JSON.parse(e.data);
                if (tmpData.data === 'pong') {
                    this.pingPong = 'pong';
                } else {
                    if (this.params.readMsg) this.params.readMsg(tmpData.data);
                }
            };
        };

        // 错误信息
        this.ws.onerror = () => {
            this.sum++;
            if (this.sum > 2) {
                if (this.params.err) this.params.err('无法与服务器取得通讯');
                this.closeWebsocket();
            } else {
                this.connect();
            }
        };
    }

    // 心跳机制
    heartCheck() {
        this.pingPong = 'ping';

        // 向后台发送“ping”检查是否连接通畅
        this.pingInterval = setInterval(() => {
            if (this.ws.readyState === 1) {
                this.ws.send(
                    JSON.stringify({ event: 'heartbeat', data: 'ping' })
                );
            }
        }, 5000);

        // 接受后台相应，如果没有接到相应则重新进行连接
        this.pongInterval = setInterval(() => {
            if (this.pingPong === 'ping') {
                this.closeHandle('pingPong没有改变为pong');
            }
            console.log('连接未断开');
            this.pingPong = 'ping';
        }, 10000);
    }

    // 关闭处理
    closeHandle() {
        if (this.status !== 'close') {
            console.log(`断开，重连websocket`);

            if (
                this.pingInterval !== undefined &&
                this.pongInterval !== undefined
            ) {
                // 清除定时器
                clearInterval(this.pingInterval);
                clearInterval(this.pongInterval);
            }

            // 重连
            this.connect();
        } else {
            console.log(`websocket手动关闭,或者正在连接`);
        }
    }

    // 关闭websocket
    closeWebsocket() {
        this.sum = 0;
        clearInterval(this.pingInterval);
        clearInterval(this.pongInterval);
        this.status = 'close';
        this.ws.send('close');
        this.ws.close();
        console.log('关闭了');
    }
}
