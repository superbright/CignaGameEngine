
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var mongoose = require('mongoose');
var GameModel = mongoose.model('GameModel');
var HighScoreGameModel = mongoose.model('HighScoreGameModel');


var gameTicks = 20;
var tickLength = 1000;
var serial;

var gameModel;


/*
 * Game controller
 */

function Game(namespaces, players, s) {
    

    this.players = players;
    this.numPlayers = players.length;

    serial = s;

    console.log('starting game with players');
    console.log(players);

    // take an array of buffers
    // either [leftBuffer] or [leftBuffer, rightBuffer]
    // stepbuffer = buffer;

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

    var self = this;

    console.log('set state ' + state);

    if(state === 'gameplay') {        

        HighScoreGameModel
            .findOne()
            .sort('-score')
            .select('player score')
            .exec(function(err, game) {
              console.log(game);

              var highscore = 0;
              if(game) {
                highscore = game.score;
              }

                _.each(self.ioChannels, function(nsp) {
                    nsp.emit('setState', {
                        state: state,
                        players: self.players,
                        highscore: highscore
                    });
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

    buffer = serial.startSerial();

    // do 20 pings
    var count = 0;
    var interval = setInterval(function() {



        console.log(buffer.queue());

        var bufferData = buffer.queue();
        buffer.reset();

        var leftPlayerData = [];
        var rightPlayerData = [];

        _.each(bufferData, function(d) {

            console.log(d);
            d = d.toString();
            var dData = d.split(',');

            if(dData.length !== 2 || dData[0].length !== 2) {
                return;
            }
            
            var strength = dData[1];
            console.log(dData);
            if(strength == 200) {
                return;
            }

            var player = dData[0][0];
            if(player == 1) {
                leftPlayerData.push(dData[0][1] + ',' + strength);
            } else {
                rightPlayerData.push(dData[0][1] + ',' + strength);
            }
        });

        console.log('leftPlayerData');
        console.log(leftPlayerData);
        console.log('rightPlayerData');
        console.log(rightPlayerData);

        // read in data from the buffer
        //
        // var bufferData = [];
        // _.each(stepbuffers, function(buffer) {
        //     bufferData.push(buffer.queue());
        //     buffer.reset();
        // });

        // fake data. uncomment above for real data
        // var data = [];
        // _.each(self.players, function() {
        //     data.push(Math.round((Math.random() - 0.5) * 10 + 10));
        // });

        // Add real data to the database model
        gameModel.data.left.steps = gameModel.data.left.steps.concat(leftPlayerData);
        if(self.numPlayers > 1) {
            gameModel.data.right.steps = gameModel.data.right.steps.concat(rightPlayerData);
        }

        console.log('pushing data: ' + [leftPlayerData.length, rightPlayerData.length]);
        _.each(self.ioChannels, function(nsp) {
            nsp.emit('step', {
                data: [leftPlayerData.length, rightPlayerData.length]
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


    var leftPlayerGame = new HighScoreGameModel({
        player: _.omit(this.players[0], 'email'),
        score: Math.round(Math.random() * 30 + 165)
    });

    leftPlayerGame.save();

    if(this.players.length > 1) {

        var rightPlayerGame = new HighScoreGameModel({
            player: _.omit(this.players[1], 'email'),
            score: Math.round(Math.random() * 30 + 165)
        });

        rightPlayerGame.save();
    }

    // todo - set winner
    gameModel.winner = 'left'; // or 'right'
    gameModel.topscore = Math.random() * 30 + 165;

    
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
    gameModel.players = this.players;
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
