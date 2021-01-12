
const constants = require('../constants');
const RoomList = require('../models/RoomList');

let roomList = new RoomList();

roomList.addRoom('test test', constants.PENGUIN_PARTY);

module.exports = {
    roomList,
};