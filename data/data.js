
const constants = require('../constants');
const RoomList = require('../models/RoomList');

let roomList = new RoomList();

roomList.addRoom('펭귄파티를 해봅시다!', constants.PENGUIN_PARTY);

module.exports = {
    roomList,
};
