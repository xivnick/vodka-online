
const constants = require('../constants');

const PenguinParty = require('../models/PenguinParty');

class Room {
    constructor(id, title, game) {
        this.id = id;
        this.title = title;
        this.users = [];
        this.game = null;

        if(game === constants.PENGUIN_PARTY){
            this.game = new PenguinParty();
        }
    }

    getData(type) {
        if(type === constants.BASIC){
            return {
                id: this.id,
                title: this.title,
            }
        }

        return {
            id: this.id,
            title: this.title,
            users: this.users,
            game: this.game,
        }
    }

    addUser(name) {
        this.users.push(name, constants.HUMAN);
    }
}

class RoomList extends Array {

    addRoom(title, game) {

        // set newId
        let newId = 100;
        for(let room of this){
            if(room.id === newId) newId++;
            else break;
        }

        // push room
        this.push(new Room(newId, title, game));
    }

    getData(type){
        return this.map(room => room.getData(type));
    }

    getRoom(id){
        for(let room of this){
            if(room.id === id) return room;
        }
        return null;
    }
}

module.exports = RoomList;