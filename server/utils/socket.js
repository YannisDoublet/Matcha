const dbUtils = require('./db.query');

module.exports = {
    NotificationCenter: (io) => {
        io.on('connection', socket => {
            socket.on('createRoom', (data) => {
                socket.join(data.id);
                console.log(`Room ${data.id} created`);
            });
            socket.on('visitProfile', (data) => {
                dbUtils.insertNotification(data.sender, data.receiver, data.type, data.img, ' visit your profile !')
                    .then(room => {
                        if (room) {
                            io.sockets.to(room).emit('reloadNotification');
                        }
                    })
            });
            socket.on('leaveRoom', (data) => {
                socket.leave(data.id);
                console.log(`Room ${data.id} leaved`);
            });
        });
    }
};