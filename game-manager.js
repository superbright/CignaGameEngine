
var players = [];
var Game = require('./game');
var game = null;


/*
 * Game controller
 */

function GameManager() {
    if (!(this instanceof GameManager)) {
        return new GameManager();
    }
}

module.exports = GameManager;

GameManager.prototype.addPlayer = function(player) {
    if(players.length < 2) {
        players.push(player);
    } else {
        throw new Error('Can\'t have more than two players');
    }
};

GameManager.prototype.startGame = function() {

    game = new Game(players);
    game.on('gameOver', function() {
        game = null;
    });

    return game;
};

GameManager.prototype.clearPlayers = function() {
    players = [];
};

