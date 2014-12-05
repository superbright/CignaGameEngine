
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');



var gameTicks = 20;
var tickLength = 1000;


/*
 * Game controller
 */

function Game(io, players) {
    

    this.players = players;
    this.numPlayers = players.length;
    this.io = io;
    // this.io.emit('setState', {state: 'screensaver'});

    this.stateIndex = -1;
    this.states = ['instructions', 'countdown', 'gameplay', 'postgame'];
}


util.inherits(Game, EventEmitter);
module.exports = Game;


Game.prototype._advanceState = function() {

    _.each(this.io.sockets.connected, function(socket, socketId) {
        socket.on('stateEnded', function(data) {});
    });

    this.stateIndex++;
    if(this.stateIndex > this.states.length - 1) {
        this.end();
    } else {
        this._setState();
        //this.end(); debug
    }
};

Game.prototype._setState = function() {

    var state = this.states[this.stateIndex];
    this.io.emit('setState', {
        state: state
    });

    if(state === 'gameplay') {
        return this.startGameplay();
    }

    this.finishCount = 0;
    var self = this;

    _.each(this.io.sockets.connected, function(socket, socketId) {
        socket.on('stateEnded', function(data) {
            if(data.state === state) {
                self.clientCompleted();
            }
        });
    });
};

Game.prototype.startGameplay = function() {

    // read in serial stuffff.

    var self = this;

    // do 20 pings
    var count = 0;
    var interval = setInterval(function() {
        self.io.emit('step', {
            data: [11, 12]
        });

        count++;
        console.log('tick');
        if(count > gameTicks - 1) {
            clearInterval(interval);
            self.endGameplay();
        }
    }, tickLength);
}

Game.prototype.endGameplay = function() {
    var self = this;
    setTimeout(function() {
        self._advanceState();
    }, 5000);
};

Game.prototype.clientCompleted = function() {
    this.finishCount++;
    if(this.finishCount >= this.numPlayers) {
        this._advanceState();
    }
};

Game.prototype.start = function() {
    this._advanceState();
};

Game.prototype.end = function() {

    // todo - 
    //  * create screenshot & email it out
    //  * emit game over event so the server can 
    //    destroy this game object?
    //
    console.log('ending the game');
    this.io.emit('setState', {
        state: 'screensaver'
    });
    this.emit('gameOver');

};
