
var players = [];
var Game = require('./game');
var SerialManager = require('./serialmanager');


var serial = new SerialManager();

/*
 * Game controller
 */

function GameManager() {
    if (!(this instanceof GameManager)) {
        return new GameManager();
    }

    this.game = null;
}


GameManager.prototype.addPlayer = function(player) {

    console.log(this.game);
    if(this.game != null) {
        throw new Error('Can\'t add players while there is a game in progress.');
    }

    if(players.length > 0 && players[0]['accessCode'] == player['accessCode']) {
        console.log('accesscode already exists');
         throw new Error('Player already added');
    }

    if(players.length < 2) {
        players.push(player);

        console.log(players);
        return players.length;
    } else {
        throw new Error('Can\'t have more than two players');
    }
};

GameManager.prototype.startGame = function() {

    console.log('starting game');
    console.log(players);

    if(this.game != null) {
        throw new Error('There is already a game in progress.');
    }


    if(!players.length) {
        throw new Error('Can\'t start game without any players.');
    }

    serial.initSerial();
    var stepqueue;

    this.game = new Game(this.ioChannels, players, serial);
    this.game.start();
    var self = this;

    // Start the 20 seconds of running!
    this.game.on('gameplayStarted', function() {
//        stepqueue = serial.startSerial();
    });

    // The twenty seconds is over.
    this.game.on('gameplayEnded', function() {
        serial.stopSerial();
    });

    // This is after the leaderboard screens, etc. have cleared.
    this.game.on('gameOver', function() {
        console.log('[gameManager] - gameOver');
        self.game.removeAllListeners();
        self.game = null;
        self.clearPlayers();
    });

};

GameManager.prototype.clearPlayers = function() {

    if(this.game != null) {
        throw new Error('Cannot clear players with a game in progress.');
    }

    players = [];
};

GameManager.prototype.setChannels = function(ioChannels) {
    this.ioChannels = ioChannels
};

// global game manager
var GM = new GameManager();

module.exports = GM;

