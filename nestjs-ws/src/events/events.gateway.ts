import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    ConnectedSocket,
    OnGatewayConnection
} from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway(8888, { path: '/echarts' })
export class EventsGateway {
    interval = null;
    wsClients = [];

    @WebSocketServer()
    server: Server;

    handleConnection(client): void {
        // 存储ws
        this.wsClients.push(client);
        console.log(`Connect当前客户端数量:${this.wsClients.length}`);

        // 判断是否开启定时器
        if (!this.interval) {
            this.activePush();
        }
    }

    handleDisconnect(client): void {
        for (let i = 0; i < this.wsClients.length; i++) {
            if (this.wsClients[i] === client) {
                this.wsClients.splice(i, 1);
                break;
            }
        }
        console.log(`Disconnect当前客户端数量:${this.wsClients.length}`);
        // 判断是否关闭定时器
        if (this.wsClients.length === 0) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    @SubscribeMessage('heartbeat')
    heartbeat(client, data: string): void {
        client.send(JSON.stringify({ event: 'heartbeat', data: 'pong' }));
    }

    private broadcast(message: any) {
        console.log(`广播当前客户端数量:${this.wsClients.length}`);
        for (let c of this.wsClients) {
            c.send(message);
        }
    }

    private getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
    }

    activePush() {
        this.interval = setInterval(() => {
            let result = [];
            for (let i = 0; i < 6; i++) {
                result.push(this.getRandomIntInclusive(0, 50));
            }
            this.broadcast(
                JSON.stringify({
                    event: 'alarmInfo',
                    data: {
                        title: {
                            text: 'ECharts 入门示例'
                        },
                        tooltip: {},
                        xAxis: {
                            data: [
                                '衬衫',
                                '羊毛衫',
                                '雪纺衫',
                                '裤子',
                                '高跟鞋',
                                '袜子'
                            ]
                        },
                        yAxis: {},
                        series: [
                            {
                                name: '销量',
                                type: 'bar',
                                data: result
                            }
                        ]
                    }
                })
            );
        }, 3000);
    }
}
