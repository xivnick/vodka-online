
const express = require('express');
const router = express.Router();

const data = require('../data/data');
const constants = require('../constants');

router.post('/account/logout', (req, res) => {

    const io = req.app.get('socketio');

    let username = req.body.username;

    for(let room of data.roomList){
        let error = room.deleteUser(username);
        if(!error) io.to(room.id).emit("update");
    }
});

router.get('/room/list', (req, res) => {

    // data refactoring
    return res.send({
        roomList: data.roomList.getData(constants.BASIC),
    });
});

router.get('/room', (req, res) => {

    let id = parseInt(req.query.id);
    let room = data.roomList.getRoom(id).getData(constants.FULL);

    return res.send({
        room: room,
    });
});

router.post('/game/start', (req, res) => {

    const io = req.app.get('socketio');

    let id = parseInt(req.body.id);
    let game = data.roomList.getRoom(id).game;

    let error = game.gameStart();

    if(error) return res.send({error});

    io.to(id).emit("update");
    return res.send({});
});

router.post('/game/join', (req, res) => {

    const io = req.app.get('socketio');

    let id = parseInt(req.body.id);
    let username = req.body.username;

    let game = data.roomList.getRoom(id).game;

    let idx = req.body.idx;

    let error = null;
    if(idx === undefined){
        error = game.addPlayer(username);
    }
    else{
        error = game.replacePlayer(username, idx);
    }

    if(error) return res.send({error});

    io.to(id).emit("update");
    return res.send({});
});

router.post('/game/leave', (req, res) => {

    const io = req.app.get('socketio');

    let id = parseInt(req.body.id);
    let username = req.body.username;

    let game = data.roomList.getRoom(id).game;

    let error = game.deletePlayer(username);

    if(error) return res.send({error});

    io.to(id).emit("update");
    return res.send({});
});

router.post('/game/reset', (req, res) => {

    const io = req.app.get('socketio');

    let id = parseInt(req.body.id);
    let room = data.roomList.getRoom(id);

    room.assignGame(room.game.name);

    io.to(id).emit("update");
    return res.send({});
});

router.post('/game/pp/play', (req, res) => {
    const io = req.app.get('socketio');

    let id = parseInt(req.body.id);
    let username = req.body.username;
    let game = data.roomList.getRoom(id).game;

    let color = req.body.color;
    let position = req.body.position;

    let error = game.playCard(username, color, position.r, position.c);

    if(error) return res.send({error});

    io.to(id).emit("update");
    return res.send({});
});

module.exports = router;
