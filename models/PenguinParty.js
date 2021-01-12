
const constants = require('../constants');
const tools = require('../tools');

const COLORS = [
    constants.RED,
    constants.BLUE,
    constants.GREEN,
    constants.YELLOW,
    constants.VIOLET,
];

const CARDINALITY = {
    2:18, 3: 12, 4: 9, 5: 7, 6: 6,
};

class PPCard {
    constructor(color) {
        this.color = color;
    }
}

class PPPlayer {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.score = 0;
        this.hands = [];
    }
}

class PenguinParty {
    constructor() {
        this.name = 'penguin party';

        this.deck = null;
        this.board = null;

        this.players = [];
        this.playing = false;

        this.refreshGame();
    }

    gameStart(){
        if(this.players.length < 2){
            return '두 명 이상의 플레이어가 필요합니다.';
        }

        this.playing = true;
        for(let player of this.players){
            player.point = 0;
            player.hands = this.deck.splice(0, CARDINALITY[this.players.length]);
        }
        return null;
    }

    refreshGame(){
        this.deck = this.newDeck();

        this.board = [
            [{}],
            [{}, {}],
            [{}, {}, {}],
            [{}, {}, {}, {}],
            [{}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {adjacent: true}, {}, {}, {}, {}],
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
        if(this.players.length === 6){
            return '플레이어가 너무 많습니다.(최대 6명)';
        }

        this.players.push(new PPPlayer(name));
    }
}

module.exports = PenguinParty;