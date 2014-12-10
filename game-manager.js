
var players = [];
var Game = require('./game');
var game = null;
var SerialManager = require('./serialmanager');


var serial = new SerialManager();

/*
 * Game controller
 */

function GameManager() {
    if (!(this instanceof GameManager)) {
        return new GameManager();
    }
}


GameManager.prototype.addPlayer = function(player) {

    if(game !== null) {
        throw new Error('Can\'t add players while there is a game in progress.');
    }

    if(players.length < 2) {
        players.push(player);
    } else {
        throw new Error('Can\'t have more than two players');
    }
};

GameManager.prototype.startGame = function() {

    console.log('starting game');
    console.log(players);


    if(!players.length) {
        throw new Error('Can\'t start game without any players.');
    }

    serial.initSerial();

    var game = new Game(this.ioChannels, players, serial.getBuffers());
    game.start();
    var self = this;

    // Start the 20 seconds of running!
    game.on('gameplayStarted', function() {
        // stepqueue = serial.startSerial();
    });

    // The twenty seconds is over.
    game.on('gameplayEnded', function() {
        // serial.stopSerial();
    });

    // This is after the leaderboard screens, etc. have cleared.
    game.on('gameOver', function() {
        game = null;
        self.clearPlayers();
    });

    return game;
};

GameManager.prototype.clearPlayers = function() {
    players = [];
};

GameManager.prototype.setChannels = function(ioChannels) {
    this.ioChannels = ioChannels
};

// global game manager
var GM = new GameManager();

module.exports = GM;

