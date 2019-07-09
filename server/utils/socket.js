const dbUtils = require('./db.query');

module.exports = {
    NotificationCenter: (io) => {
        io.on('connection', socket => {
            socket.on('createRoom', data => {
                socket.join(data.id);
                console.log(`Room ${data.id} created !`);
            });
            socket.on('createChatRoom', data => {
                socket.join(data.id);
                console.log(`Chatroom ${data.id} joined !`);
            });
            socket.on('visitProfile', data => {
                dbUtils.insertNotification(data.sender, data.receiver, data.type, ' visited your profile !')
                    .then(room => {
                        if (room) {
                            io.sockets.to(room).emit('reloadNotification', {message: false});
                        }
                    })
            });
            socket.on('likeUser', data => {
                dbUtils.findIdByUsername(data.receiver)
                    .then(room => {
                        if (room) {
                            io.sockets.to(room).emit('reloadNotification', {message: false});
                        }
                    })
            });
            socket.on('dislikeUser', data => {
                dbUtils.findIdByUsername(data.receiver)
                    .then(room => {
                        if (room) {
                            io.sockets.to(room).emit('reloadNotification', {message: false});
                        }
                    })
            });
            socket.on('matchUser', data => {
                dbUtils.findIdByUsername(data.secondUser)
                    .then(room => {
                        if (room) {
                            io.sockets.to(data.firstUser).emit('reloadNotification', {message: false});
                            io.sockets.to(room).emit('reloadNotification', {message: false});
                        }
                    });
            });
            socket.on('fetchMessage', data => {
                if (data.id) {
                    io.sockets.to(data.id).emit('reloadMessage');
                    io.sockets.to(data.id).emit('reloadMessage');
                }
            });
            socket.on('messageNotif', data => {
                if (data.conv_id && data.sender) {
                    dbUtils.fetchReceiver(data.conv_id, data.sender)
                        .then(room => {
                            if (room) {
                                io.sockets.to(room).emit('reloadNotification', {message: true});
                            }
                        })
                }
            });
            socket.on('reloadProfile', data => {
               if (data.id) {
                   io.sockets.to(data.id).emit('reloadProfile', {message: false});
               }
            });
            socket.on('leaveChatRoom', data => {
                socket.leave(data.id);
                console.log(`Chatroom ${data.id} leaved !`)
            });
            socket.on('leaveRoom', data => {
                socket.leave(data.id);
                console.log(`Room ${data.id} leaved !`);
            });
        });
    }
};