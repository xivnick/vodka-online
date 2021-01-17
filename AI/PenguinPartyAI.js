
const constants = require('../constants');
const network = require('../network');
const tools = require('../tools');

const axios = require('axios');

const baseURL = network.url + '/api';

class PenguinPartyAI {
    constructor(gameId, botIndex) {
        this.gameId = gameId;
        this.botIndex = botIndex;
    }

    async play() {
        let game = null;
        let validPlaces = null;

        await axios.get(baseURL + '/game', {
            params: {
                id: this.gameId,
            }
        }).then((res) => {
            game = res.data.game;
        }).catch((err) => {
            console.log(err);
        });

        await axios.get(baseURL + '/game/validPlaces', {
            params: {
                id: this.gameId,
            }
        }).then((res) => {
            validPlaces = res.data.validPlaces;
        }).catch((err) => {
            console.log(err);
        });

        let bot = game.players[this.botIndex];

        tools.shuffleArray(bot.hands);

        let played = false;
        for(let card of bot.hands){

            if(validPlaces[card.color].length){
                played = true;

                let position = validPlaces[card.color][tools.getRandomInt(0, validPlaces[card.color].length)];

                axios.post(baseURL + '/game/pp/play', {
                    id: this.gameId,
                    username: game.players[this.botIndex].name,
                    position,
                    color: card.color,
                }).then((res) => {
                    if(res.data.error){
                        console.log(res.data.error);
                    }
                }).catch((err) => {
                    console.log(err);
                });

                break;
            }
        }
    }
}

module.exports = PenguinPartyAI;