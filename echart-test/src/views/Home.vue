<template>
    <div class="home">
        <div id="main" v-if="realData"></div>
        <div class="empty" v-else>暂无数据</div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import CustomWebSocket from '../utils/CustomWebSocket';

export default {
    name: 'Home',
    components: {},
    data() {
        return {
            wsPath: '',
            ws: null,
            realData: null,
            myChart: null
        };
    },
    methods: {
        // 初始化数据
        async initData() {
            try {
                let response = await fetch(
                    'http://127.0.0.1:3000/events/initData'
                );
                if (response.status === 200) {
                    let data = await response.json();
                    // 模拟没有数据的情况
                    if (!(Math.floor(Math.random() * 10) / 2)) {
                        // 赋值数据
                        this.realData = data;
                        // 在dom更新后获取到div进行绘图
                        this.$nextTick(() => {
                            // 初始化echarts实例
                            this.myChart = echarts.init(
                                document.getElementById('main')
                            );
                            // 绘图
                            this.myChart.setOption(this.realData);
                        });
                    }
                }
            } catch (error) {
                console.log('Fetch Error: ', error);
            }
        },
        // 创建websocket
        connetWebsocket() {
            const self = this;
            self.wsPath = `ws://localhost:8888/echarts`;
            self.ws = new CustomWebSocket(self.wsPath, {
                readMsg(msg) {
                    if (self.myChart) {
                        self.myChart.setOption(msg);
                    } else {
                        self.realData = msg;
                        self.$nextTick(() => {
                            // 基于准备好的dom，初始化echarts实例
                            self.myChart = echarts.init(
                                document.getElementById('main')
                            );
                            self.myChart.setOption(msg);
                        });
                    }
                },
                err() {
                    this.$message.warning(
                        '无法与服务器进行连接，请手动刷新界面'
                    );
                }
            });
        },
        // 初始化页面
        async initPage() {
            // 初始化数据
            await this.initData();
            // 连接websocket
            this.connetWebsocket();
        }
    },
    mounted() {
        this.initPage();
    },
    beforeDestroy() {
        this.ws.closeWebsocket();
    }
};
</script>
<style lang="less" scoped>
#main {
    width: 500px;
    height: 500px;
}
.empty {
    width: 500px;
    height: 500px;
    font-size: 36px;
    text-align: center;
    line-height: 500px;
}
.realData {
    width: 500px;
    height: 200px;
    background-color: skyblue;
}
</style>
