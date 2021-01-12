
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

    let id = req.query.id;
    let room = data.roomList.getRoom(id);


});

module.exports = router;