
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var mongoose = require('mongoose');
var GameModel = mongoose.model('GameModel');
var HighScoreGameModel = mongoose.model('HighScoreGameModel');
var d3 = require('d3');

var LedManager = require('./led-manager');


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
    this.ledManager = new LedManager();
    this.ledManager.initSerial();
    if(this.numPlayers > 1) {
        this.ioChannels.push(namespaces[1]);
    }

    this.leftBoostActive = false;
    this.rightBoostActive = false;
    this.leftBoostActived = false;
    this.rightBoostActived = false;

    this.stateIndex = -1;
    this.states = ['instructions', 'countdown', 'gameplay', 'postgame'];
}


util.inherits(Game, EventEmitter);
module.exports = Game;


Game.prototype.activateBoost = function(position) {

    var self = this;
    if(position === 0) {

        console.log('activating left boost');

        if(this.leftBoostActived) {
            return;
        }
        this.leftBoostActive = true;
        this.leftBoostActived = true;
        this.ioChannels[0].emit('boost');
    } else if(position === 1){
        console.log('activating right boost');
        if(this.rightBoostActived) {
            return;
        }
        this.rightBoostActive = true;
        this.rightBoostActived = true;

        this.ioChannels[1].emit('boost');
    }

    setTimeout(function() {
        self.deactivateBoost(position);
    }, 3000);

};


Game.prototype.deactivateBoost = function(position) {
    if(position === 0) {
        this.leftBoostActive = false;
    } else if(position === 1){
        this.rightBoostActive = false;
    }
}


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

    var leftTotal = 0, rightTotal = 0;

    var ledMap = d3.scale.linear().domain([0, 225]).range([0, 19]);

    // do 20 pings
    var count = 0;
    var interval = setInterval(function() {

        console.log(buffer.queue());

        var bufferData = buffer.queue();
        buffer.reset();

        var leftPlayerData = [];
        var rightPlayerData = [];

        _.each(bufferData, function(d) {

            // console.log(d);
            d = d.toString().replace(/(\r\n|\n|\r)/gm,'');

            if(d[0] === 'x') {
                console.log('GOT A BUTTON PRESS');
                console.log(d);

                self.activateBoost(parseInt(d[1]));
                return;
            }

            var dData = d.split(',');

            if(dData.length !== 2 || dData[0].length !== 2) {
                return;
            }
            
            var strength = dData[1];
            // console.log(dData);
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
        // console.log('leftPlayerData');
        // console.log(leftPlayerData);
        // console.log('rightPlayerData');
        // console.log(rightPlayerData);

        if(self.leftBoostActive) {
            leftPlayerData = leftPlayerData.concat(leftPlayerData);
        }
        if(self.rightBoostActive) {
            rightPlayerData = rightPlayerData.concat(rightPlayerData);

        }

        // Add real data to the database model
        gameModel.data.left.steps = gameModel.data.left.steps.concat(leftPlayerData);

        leftTotal += leftPlayerData.length;
        rightTotal += rightPlayerData.length;
        if(self.numPlayers > 1) {
            gameModel.data.right.steps = gameModel.data.right.steps.concat(rightPlayerData);
            self.ledManager.sendStepValues(ledMap(leftTotal), ledMap(rightTotal));
        } else {
            self.ledManager.sendStepValues(ledMap(leftTotal));    
        }


        

        // self.ledManager.sendStepValues(Math.round(Math.min(leftPlayerData.length * 1.6, 19)), Math.round(Math.min(rightPlayerData.length * 1.6, 19)));

        // console.log('pushing data: ' + [leftPlayerData.length, rightPlayerData.length]);
        _.each(self.ioChannels, function(nsp) {
            nsp.emit('step', {
                data: [leftPlayerData.length, rightPlayerData.length]
            });
        });

        count++;
        // console.log('tick');

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
        score: gameModel.data.left.steps.length
    });

    var winner = 'left';
    var topscore = leftPlayerGame.score;

    leftPlayerGame.save();

    if(this.players.length > 1) {

        var rightPlayerGame = new HighScoreGameModel({
            player: _.omit(this.players[1], 'email'),
            score: gameModel.data.left.steps.length
        });

        rightPlayerGame.save();

        if(rightPlayerGame.score > leftPlayerGame.score) {
            winner = 'right';
            topscore = rightPlayerGame.score;
        }
    }

    // todo - set winner
    gameModel.winner = winner;
    gameModel.topscore = topscore;

    
    gameModel.save(function(err) {
    });

    setTimeout(function() {

        setTimeout(function() {
            self.ledManager.sendStepValues(-1, -1);
        }, 10000);
        
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
    var self = this;
    setTimeout(function() {
        self.ledManager.sendStepValues(-1, -1);
    }, 2000);
    
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
