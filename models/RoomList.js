
const constants = require('../constants');

const PenguinParty = require('../models/PenguinParty');

class Room {
    constructor(id, title, game) {
        this.id = id;
        this.title = title;
        this.users = [];
        this.game = null;

        this.assignGame(game);
    }

    assignGame(game){
        if(this.game) delete this.game;

        if(game === constants.PENGUIN_PARTY){
            this.game = new PenguinParty(this.id);
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
        console.log(`add user ${name} to ${this.id}`);
        if(!this.users.includes(name)) this.users.push(name);
    }

    deleteUser(name) {
        let deleted = false;

        for(let i = 0; i < this.users.length; i++){
            if(this.users[i] === name){
                this.users.splice(i, 1);
                deleted = true;
                break;
            }
        }

        if(!deleted){
            return '방에 존재하지 않는 유저입니다.'
        }
        else{
            this.game.deletePlayer(name);
        }
        return null;
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
