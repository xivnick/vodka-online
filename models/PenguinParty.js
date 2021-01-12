
const constants = require('../constants');
const tools = require('../tools');

const COLORS = [
    constants.RED,
    constants.BLUE,
    constants.GREEN,
    constants.YELLOW,
    constants.VIOLET,
];

class PPCard {
    constructor(color) {
        this.color = color;
    }
}

class PPPlayer {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.point = 0;
        this.cards = [];
    }
}

class PenguinParty {
    constructor() {
        this.name = 'penguin party';

        this.deck = this.newDeck();

        this.players = [];

        this.board = [
            [null],
            [null, null],
            [null, null, null],
            [null, null, null, null],
            [null, null, null, null, null],
            [null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
        ];
    }

    newDeck(){
        let deck = [];

        for(let color of COLORS){
            // 색깔마다 각 7장씩
            for(let i = 0; i < 7; i++) {
                deck.push(new PPCard(color));
            }
        }

        // 하늘색 카드는 한장 더
        deck.push(new PPCard(constants.BLUE));

        // 카드 섞기
        deck = tools.shuffleArray(deck);

        return deck;
    }

    addPlayer(name){
        if(this.players.length === 5){
            return null;
        }

        this.players.append(new PPPlayer(name));
    }
}

module.exports = PenguinParty;