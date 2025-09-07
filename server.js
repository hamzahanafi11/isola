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

app.get('/kill', (req, res) => {
    res.sendFile(__dirname + '/admin/kill.html');
});


app.get('/rooms-alive', (req, res) => {
    const rooms = io.of("/").adapter.rooms;
    const gameRooms = [];
    Object.keys(rooms).forEach(name => {
        if(name.includes('game/')) {
            const room = io.sockets.adapter.rooms[name];
            const marianSocketId = Object.keys(room.sockets)[0] || null;
            const stevenSocketId = Object.keys(room.sockets)[1]|| null;
            let player1 = null;
            let player2 = null;
            if(marianSocketId != null) {
                player1 = io.sockets.sockets[marianSocketId].marian
            }
            if(stevenSocketId != null) {
                player2 = io.sockets.sockets[stevenSocketId].steven
            }
            gameRooms.push({
                name : name.replace("/game/", ""),
                players : [player1, player2]
            });
        }
    });

    res.json(gameRooms);
});

app.post('/delete-rooms', (req, res) => {
    const rooms = io.sockets.adapter.rooms;

    Object.keys(rooms).forEach(roomName => {
        if (roomName.includes("game/")) {
            const room = rooms[roomName];
            if (room && room.sockets) {
                Object.keys(room.sockets).forEach(socketId => {
                    const socket = io.sockets.sockets[socketId];
                    if (socket) {
                        socket.leave(roomName);
                    }
                });
            }
        }
    });
});

/**
 * Socket.IO server-side logic
 */
io.on('connection', (socket) => {

    socket.on('join', (roomName, username) => {
        if(isRoomEmpty(roomName)) {
            socket.join('/game/'+roomName);
            socket.marian = username;
            console.log(username + " joined room: " + roomName);
            io.in('/game/'+roomName).emit('marianJoining', username);
        }
        else if(hasOnePlayer(roomName)) {
            const marianUsername = getUsernamesInRoom(roomName);
            socket.join('/game/'+roomName);
            console.log(username + " joined room: " + roomName);
            socket.steven = username;
            io.in('/game/'+roomName).emit('marianJoining', marianUsername);
            io.in('/game/'+roomName).emit('stevenJoining', username);
        } else {
            socket.emit('fullRoom', roomName);
        }
    });

    socket.on('move', (data) => {
        const room = data.roomName;
        socket.to('/game/'+room).emit('move', data.game);
    });

    socket.on('block', (data) => {
        const room = data.roomName;
        socket.to('/game/'+room).emit('block', data.game);
    });

    socket.on('switchTurn', (data) => {
        const room = data.roomName;
        io.in('/game/'+room).emit('switchTurn', data.game);
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
    return true ? avalaibleRooms.includes('/game/'+name) : false;
}

/**
 * Check if a room has at least one member
 */
hasOnePlayer = (name) => {
    const room = io.sockets.adapter.rooms['/game/'+name];
    return room ? room.length === 1 : false;
}

/**
 * Check if a room has at least one member
 */
isRoomEmpty = (name) => {
    const room = io.sockets.adapter.rooms['/game/'+name];
    return room ? room.length === 0 : true;
}

getUsernamesInRoom = (roomName) => {
    const room = io.sockets.adapter.rooms['/game/'+roomName];
    if (!room) return null;

    const socketId = Object.keys(room.sockets)[0];
    console.log(`In room "${roomName}" first player is "${io.sockets.sockets[socketId].marian}"`);
    return io.sockets.sockets[socketId].marian;
}
