
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var mongoose = require('mongoose');
var GameModel = mongoose.model('GameModel');


var gameTicks = 20;
var tickLength = 1000;
var stepbuffers;

var gameModel;


/*
 * Game controller
 */

function Game(namespaces, players, buffers) {
    

    this.players = players;
    this.numPlayers = players.length;

    // take an array of buffers
    // either [leftBuffer] or [leftBuffer, rightBuffer]
    stepbuffers = buffers;

    this.ioChannels = [];
    this.ioChannels.push(namespaces[0]);
    if(this.numPlayers > 1) {
        this.ioChannels.push(namespaces[1]);
    }

    this.stateIndex = -1;
    this.states = ['instructions', 'countdown', 'gameplay', 'postgame'];
}


util.inherits(Game, EventEmitter);
module.exports = Game;


Game.prototype._advanceState = function() {

    _.each(this.ioChannels, function(nsp) {
        _.each(nsp.connected, function(socket, socketId) {
            socket.on('stateEnded', function(data) {});
        });
    });


    this.stateIndex++;
    if(this.stateIndex > this.states.length - 1) {
        this.end();
    } else {
        this._setState();
        //this.end(); //debug
    }
};

Game.prototype._setState = function() {

    var state = this.states[this.stateIndex];
    var self = this;
    this.finishCount = 0;

    console.log('set state ' + state);

    if(state === 'gameplay') {        

        _.each(this.ioChannels, function(nsp) {
            nsp.emit('setState', {
                state: state,
                players: self.players
            });
        });

        return this.startGameplay();
    }


    _.each(this.ioChannels, function(nsp) {

        nsp.emit('setState', {
            state: state
        });
    });

    var self = this;

    _.each(this.ioChannels, function(nsp) {
        _.each(nsp.connected, function(socket, socketId) {
            socket.on('stateEnded', function(data) {
                if(data.state === state) {
                    self.clientCompleted();
                }
            });
        });
    });
};

Game.prototype.startGameplay = function() {

    // read in serial stuffff.
    var self = this;

    this.emit('gameplayStarted');

    // do 20 pings
    var count = 0;
    var interval = setInterval(function() {

        // read in data from the buffer
        //
        // var bufferData = [];
        // _.each(stepbuffers, function(buffer) {
        //     bufferData.push(buffer.queue());
        //     buffer.reset();
        // });

        // fake data. uncomment above for real data
        var data = [];
        _.each(self.players, function() {
            data.push(Math.round((Math.random() - 0.5) * 10 + 10));
        });

        // Add real data to the database model
        gameModel.data.left.steps = gameModel.data.left.steps.concat([data[0]]);
        if(data.length > 1) {
            gameModel.data.right.steps = gameModel.data.right.steps.concat([data[1]]);
        }

        console.log('pushing data: ' + data);
        _.each(self.ioChannels, function(nsp) {
            nsp.emit('step', {
                data: data
            });
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
    
    this.emit('gameplayEnded');

    console.log(gameModel);
    
    gameModel.save(function(err) {
    });

    setTimeout(function() {
        self._advanceState();
    }, 5000);
};

Game.prototype.clientCompleted = function() {
    this.finishCount++;
    if(this.finishCount >= this.numPlayers) {
        this.finishCount = 0;
        this._advanceState();
    }
};

Game.prototype.start = function() {
    gameModel = new GameModel();
    this._advanceState();
};

Game.prototype.end = function() {

    // TODO - 
    //  * create screenshot & email it out
    //  * emit game over event so the server can 
    //    destroy this game object?
    //
    console.log('ending the game');

    _.each(this.ioChannels, function(nsp) {
        nsp.emit('setState', {
            state: 'screensaver'
        });        
    });

    this.emit('gameOver');

};
