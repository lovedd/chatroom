<template>
    <div class="app-main">
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
                    <div class="item-box right-hook" v-if="item.type === 3">
                        <div class="right">
                            <div>
                                {{ item.msgOwner.visiterName }}
                            </div>
                            <div class="text"><span class="horn">~</span>{{ item.msg }}
                            </div>
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
        <div class="footer">
            <div class="main">
                <input type="text" class="input" v-model="inputValue" @keyup.enter="sendEvent" />
                <input type="text" class="input" disabled  v-model="inputValue"/>
                <span class="send" :class="{logout: true}" @click="sendEvent">发送</span>
            </div>
        </div>
    </div>
</template>

<script>
    import io from 'socket.io-client';
    import $ from 'jquery';

    export default {
        data () {
            return {
                userNameArray: ['向大', '胡二', '张三', '李四', '王五', '刘六', '许七', '丁八', '九九'],
                visiterInfo: {},
                visiterCount: '',
                messageList: [],
                inputValue: '',
                visiterList: [],
                visiterName: ''
            };
        },
        mounted () {
            let self = this;
            let code = this.getUrlParam('code');
            $.get('http://1.lovedss.applinzi.com/jsapi_ticket.php?code=' + code, function (result) {
//                console.log(result);
//                $("#a").html(JSON.parse(result).nickname);
                self.visiterName = JSON.parse(result).nickname;
                self.connectEvent();
            });
        },
        methods: {
            getUrlParam (name) {
                var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); // 构造一个含有目标参数的正则表达式对象
                var r = window.location.search.substr(1).match(reg); // 匹配目标参数
                if (r != null) return unescape(r[2]);
                return null; // 返回参数值
            },
            connectEvent () {
                let self = this;
//                let random = Math.floor(Math.random() * 9);
                this.visiterInfo = {
//                    visiterName: this.userNameArray[random],
                    visiterName: this.visiterName,
                    visiterId: new Date().getTime()
                };
                this.httpServer = io.connect('http://172.19.10.35:8081');
                this.httpServer.emit('login', this.visiterInfo);
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
            trim (s) {
                return s.replace(/(^\s*)|(\s*$)/g, '');
            },
            sendEvent () {
                this.inputValue = this.trim(this.inputValue);
                if (this.inputValue.length > 0) {
                    this.httpServer.emit('message', {msg: this.inputValue, msgOwner: this.visiterInfo});
                    this.messageList.push({type: 3, msg: this.inputValue, msgOwner: this.visiterInfo});
                    this.inputValue = '';
                }
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
</style>
