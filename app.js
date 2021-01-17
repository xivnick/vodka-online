
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3333;

const bodyParser = require('body-parser');

const constants = require('./constants');
const data = require('./data/data');
const api = require('./routes/api');

app.set('socketio', io);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static('static'));

app.use('/api', api);

app.get('/', (req, res) => {
    return res.render('index.ejs');
});

app.get('/room/:id', (req, res) => {
    const id = parseInt(req.params.id);

    let room = data.roomList.getRoom(id);

    if(room.game.name === constants.PENGUIN_PARTY){
        return res.render('room_pp.ejs', {id: id});
    }

    return res.send(room);
});

app.get('/test', (req, res) => {
    return res.send(data.roomList);
});

io.on('connection', (socket) => {
    socket.emit('connection');
    console.log(`[conn] client connected: ${socket.id}`);

    socket.on('join', (name, id) => {
        socket.name = name;
        socket.join(id);
        data.roomList.getRoom(id).addUser(name);
        console.log(socket.name);
    })
});

http.listen(port, () => {
    console.log(`server is listening at localhost:${port}`);
});
