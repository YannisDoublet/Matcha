module.exports = {
    NotificationCenter: (io) => {
        io.on('connection', socket => {
            socket.on('createRoom', (data) => {
                socket.join(data.id);
                console.log(`Room ${data.id} created`);
            });
            socket.on('visitProfile', (data) => {
                console.log(data);
                // console.log(`Room ${data.id} leaved`);
            });
            socket.on('leaveRoom', (data) => {
                socket.leave(data.id);
                console.log(`Room ${data.id} leaved`);
            });
        });
    }
};