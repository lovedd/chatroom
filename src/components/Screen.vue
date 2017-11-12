<template>
    <div class="app-main">
        <div class="center">
            一个聊天室
        </div>
        <div class="qrcode center" id='qrcode'>
            <img src="" width="300" height="300" id='qrcodeImg' />
        </div>
        <div class="content" ref="scroll">
            <div class="height-hook">
                <div v-for="(item, index) in messageList" >
                    <div class="item-box left-hook" v-if="item.type === 2">
                        <div class="left">
                            <div>
                                {{ item.msgOwner.visiterName }}
                            </div>
                            <div class="text"><span class="horn">~</span>{{ item.msg }}</div>
                        </div>
                        <div class="center">
                            <!--<div class="user">{{ item.msgOwner.visiterName}}:</div>-->
                            <!--<div class="text"><span class="horn">~</span>{{ item.msg }}</div>-->
                        </div>
                        <br style="clear: both;"/>
                    </div>
                    <div class="item-box center-hook" v-if="item.type === 1">
                        <span class="tip">{{ item.msg }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import io from 'socket.io-client';

    export default {
        data () {
            return {
                visiterInfo: {},
                visiterCount: '',
                messageList: [],
                inputValue: '',
                visiterList: []
            };
        },
        mounted () {
            this.connectEvent();
            this.getQryImg();
        },
        methods: {
            connectEvent () {
                let self = this;
                this.httpServer = io.connect('http://172.19.10.35:8081');
                this.httpServer.on('login', function (obj) {
                    self.visiterCount = obj.visiterCount;
                    self.messageList.push({type: 1, msg: '用户 ' + obj.msgOwner.visiterName + ' 加入聊天', msgUser: obj.msgOwner});
//                    debugger;
//                    console.log(1);
                });
                this.httpServer.on('message', function (obj) {
                    self.messageList.push({type: 2, msg: obj.msg, msgOwner: obj.msgOwner});
                });
            },
            getQryImg () {
                let qrcodeImg = document.getElementById('qrcodeImg');
                let text = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx919e32b36d33f289%26redirect_uri=http%3A%2F%2F1.lovedss.applinzi.com%2Fchat%2Findex.html%23%2Froom%26response_type=code%26scope=snsapi_userinfo%26state=STATE#wechat_redirect';
//                qrcodeImg.src = 'http://qr.liantu.com/api.php?text=http://' + '172.19.10.35:8080';
                qrcodeImg.src = 'http://qr.liantu.com/api.php?text=' + text;
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .left {
        text-align: left;
    }
    .right {
        text-align: right;
    }
    .footer input{
        height: 60px;
    }
    .center {
        text-align: center;
    }
</style>
