
const constants = require('../constants');
const tools = require('../tools');

const COLORS = [
    constants.PINK,
    constants.BLUE,
    constants.GREEN,
    constants.YELLOW,
    constants.PURPLE,
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
        this.startPlayer = 0;
        this.round = 0;

        this.refreshGame();
    }

    gameStart(){
        if(this.players.length < 2){
            return '두 명 이상의 플레이어가 필요합니다.';
        }

        this.playing = true;
        this.startPlayer = tools.getRandomInt(0, this.players.length);
        this.round = 0;


        for(let player of this.players) {
            player.point = 0;
        }

        this.startRound();
        return null;
    }

    startRound(){
        this.refreshGame();
        this.turn = this.startPlayer;
        for(let player of this.players){
            player.hands = this.deck.splice(0, CARDINALITY[this.players.length]);
        }

        if(this.players.length === 5){
            this.board[7][4] = this.deck.splice(0,1);
        }
    }

    endRound(){
        // 점수계산
        for(let player of this.players){
            if(player.hands.length === 0){
                if(player.point <= -10) player.point += 10;
                else if(player.point <= -6) player.point += 6;
                else if(player.point === -5) player.point += 5;
                else if(player.point <= -2) player.point += 2;
                else player.point = 0;
            }
            else{
                player.point -= player.hands.length;
            }
        }

        this.round++;
        if(this.round === this.players.length){
            return constants.GAME_END;
        }

        return constants.ROUND_END;
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
            [{}, {}, {}, {}, {adjacent: true}, {}, {}, {}],
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

        if(this.players.map(player => player.name).includes(name)){
            return '이미 참가중입니다.';
        }

        if(this.playing){
            return '게임이 이미 시작되었습니다.';
        }

        if(name === '$bot'){
            this.players.push(new PPPlayer(`bot ${this.players.length+1}`, constants.BOT));
        }
        else{
            this.players.push(new PPPlayer(name, constants.HUMAN));
        }
        return null;
    }

    deletePlayer(name){
        let deleted = false;

        for(let i = 0; i < this.players.length; i++){
            if(this.players[i].name === name){
                if(this.playing){
                    this.players[i].name = 'EMPTY';
                    this.players[i].type = constants.EMPTY;
                }
                else{
                    this.players.splice(i, 1);
                }

                deleted = true;
                break;
            }

        }

        if(!deleted){
            return '이미 관전중입니다.'
        }

        for(let i = 0; i < this.players.length; i++){
            if(this.players[i].type === constants.BOT){
                this.players[i].name = `bot ${i+1}`;
            }
        }

        return null;
    }

    replacePlayer(name, idx){
        if(idx >= this.players.length){
            return '해당 자리는 입장할 수 없습니다.'
        }

        if(this.players[idx].type === constants.HUMAN){
            return '사람이 플레이하는 자리는 입장할 수 없습니다.'
        }

        if(name === '$bot'){
            if(this.players[idx].type === constants.BOT){
                if(this.playing){
                    this.players[idx].name = 'EMPTY';
                    this.players[idx].type = constants.EMPTY;
                }
                else{
                    this.players.splice(idx, 1);
                }
            }
            else{
                this.players[idx].name = `bot ${idx+1}`;
                this.players[idx].type = constants.BOT;
            }
        }
        else{
            this.players[idx].name = name;
            this.players[idx].type = constants.HUMAN;
        }

        return null;
    }

    getPlayerIdx(username){
        for(let idx = 0; idx < this.players.length; idx++){
            if(this.players[idx].name === username){
                return idx;
            }
        }
        return null;
    }

    countCard(cards){
        let count = 0;

        for(let card of cards){
            if(card.color) count++;
        }

        return count;
    }

    turnOver(username){
        if(username && this.players[this.turn].name !== username){
            return '다른 플레이어의 차례예요.';
        }

        let series = 0;
        while(true){
            this.turn++;
            if(this.turn === this.players.length) this.turn = 0;

            let nextPlay = false;

            const nextHands = this.players[this.turn].hands;

            for(let card of nextHands){
                for(let r = 0; r < 8 && !nextPlay; r++){
                    for(let c = 0; c < this.board[r].length && !nextPlay; c++){
                        if(this.validPlace(card.color, r, c)){
                            nextPlay = true;
                            break;
                        }
                    }
                }
                if(nextPlay) break;
            }
            if(nextPlay){
                series = 0;
                break;
            }
            series++;
            if(series === this.players.length){
                return this.endRound();
            }
        }

        return null;
    }

    validPlace(color, r, c){
        // 이미 카드가 놓여있는 경우
        if(c < this.board[r].length && this.board[r][c].color) return false;

        // 시작점임
        if(c < this.board[r].length && this.board[r][c].adjacent) return true;

        if(r === 7){
            if(c !== 0 && this.board[r][c-1].color || c < this.board[r].length - 1 && this.board[r][c+1].color){
                return true;
            }
        }
        else if(this.board[r+1][c].color && this.board[r+1][c+1].color){
            if(this.board[r+1][c].color === color || this.board[r+1][c+1].color === color){
                return true;
            }
        }

        return false;
    }

    playCard(username, color, r, c){

        let pi = this.getPlayerIdx(username);

        if(pi !== this.turn){
            return '다른 플레이어의 차례예요.';
        }

        let player = this.players[pi];

        let ci = 0;
        while(ci < player.hands.length){
            if(player.hands[ci].color === color) break;
            ci++;
        }

        if(ci === player.hands.length){
            return '해당 카드를 낼 수 없습니다. 다시 확인해주세요.';
        }

        if(!this.validPlace(color, r, c)){
            return '해당 카드를 낼 수 없습니다. 다시 확인해주세요.';
        }

        // 카드 내기
        player.hands.splice(ci, 1);

        if(this.countCard(this.board[7]) % 2 && r === 7 && c > 4){
            for(let rr = 0; rr < 8; rr++){
                for(let cc = 0; cc < this.board[rr].length-1; cc++){
                    this.board[rr][cc] = this.board[rr][cc+1];
                }
            }
            c--;
        }

        if(this.countCard(this.board[7]) % 2 === 0 && r === 7 && c < 4){
            for(let rr = 0; rr < 8; rr++){
                for(let cc = this.board[rr].length-1; cc > 0; cc--){
                    this.board[rr][cc] = this.board[rr][cc-1];
                }
            }
            c++;
        }
        this.board[r][c] = {color: color};

        return this.turnOver();
    }
}

module.exports = PenguinParty;
