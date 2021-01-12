
const express = require('express');
const router = express.Router();

const data = require('../data/data');
const constants = require('../constants');

router.get('/room/list', (req, res) => {

    // data refactoring
    res.send({
        roomList: data.roomList.getData(constants.BASIC),
    });
});

router.get('/room', (req, res) => {

    let id = parseInt(req.query.id);
    let room = data.roomList.getRoom(id).getData(constants.FULL);

    res.send({
        room: room,
    });
});

router.post('/game/start', (req, res) => {

    const io = req.app.get('socketio');

    let id = parseInt(req.body.id);
    let game = data.roomList.getRoom(id).game;

    let error = game.gameStart();

    if(error) res.send({error});

    io.to(id).emit("update");
    return res.send({});
})

router.post('/game/join', (req, res) => {

    const io = req.app.get('socketio');

    let id = parseInt(req.body.id);
    let username = req.body.username;

    let game = data.roomList.getRoom(id).game;

    let error = game.addPlayer(username);

    if(error) res.send({error});

    io.to(id).emit("update");
    return res.send({});
})

module.exports = router;