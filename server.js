let express = require('express');
let app = express();
let http = require('http').createServer(app);

// Correct import for CommonJS
let io = require('socket.io')(http);

/**
 * serve app static files 
 */
app.use(express.static('./'));

/**
 * Routing
 */
app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/game/board.html');
});

app.get('/room', (req, res) => {
    res.sendFile(__dirname + '/game/room.html');
});

/**
 * Socket.IO server-side logic
 */
io.on('connection', (socket) => {

    socket.on('join', (roomName, username) => {
        if(isRoomEmpty(roomName)) {
            socket.join(roomName);
            socket.marian = username;
            console.log(username + " joined room: " + roomName);
            io.in(roomName).emit('marianJoining', username);
        }
        else if(hasOnePlayer(roomName)) {
            const marianUsername = getUsernamesInRoom(roomName);
            socket.join(roomName);
            console.log(username + " joined room: " + roomName);
            io.in(roomName).emit('marianJoining', marianUsername);
            io.in(roomName).emit('stevenJoining', username);
        } else {
            socket.emit('fullRoom', roomName);
        }
    });

    socket.on('move', (data) => {
        const room = data.roomName;
        socket.to(room).emit('move', data.game);
    });

    socket.on('block', (data) => {
        const room = data.roomName;
        socket.to(room).emit('block', data.game);
    });

    socket.on('switchTurn', (data) => {
        const room = data.roomName;
        io.in(room).emit('switchTurn', data.game);
    });

});

http.listen(8080, () => {
    console.log("Server running on http://localhost:8080");
});

/**
 * Check if a room exist or not!
 */
roomExist = (name) => {
    const avalaibleRooms = Object.keys(io.sockets.adapter.rooms);
    return true ? avalaibleRooms.includes(name) : false;
}

/**
 * Check if a room has at least one member
 */
hasOnePlayer = (name) => {
    const room = io.sockets.adapter.rooms[name];
    return room ? room.length === 1 : false;
}

/**
 * Check if a room has at least one member
 */
isRoomEmpty = (name) => {
    const room = io.sockets.adapter.rooms[name];
    return room ? room.length === 0 : true;
}

getUsernamesInRoom = (roomName) => {
    const room = io.sockets.adapter.rooms[roomName];
    if (!room) return null;

    const socketId = Object.keys(room.sockets)[0];
    console.log(`In room "${roomName}" first player is "${io.sockets.sockets[socketId].marian}"`);
    return io.sockets.sockets[socketId].marian;
}
