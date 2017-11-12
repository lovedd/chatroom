const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var visiterCount = 0;
io.on('connection', function (socket) {
    console.log('新连接已创建 !');

    // 监听新用户加入
    socket.on('login', function (obj) {
        console.log(obj.visiterName + '加入了群聊');
        visiterCount++;
        io.sockets.emit('login', {visiterCount: visiterCount, msgOwner: obj});
    });

    // 监听用户退出
    socket.on('disconnect', function () {
    });

    // 监听用户发布聊天内容
    socket.on('message', function (obj) {
        this.broadcast.emit('message', obj); // 广播给自己以外的所有用户
        console.log(obj.msgOwner.visiterName + '说：' + obj.msg);
    });

});

http.listen(8081, function () {
    console.log('监听端口:8081');
});


