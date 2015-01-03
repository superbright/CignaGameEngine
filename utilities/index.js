var webshot = require('webshot');
var radiant = require('./radiant');
var path = require('path');
var mongoose = require('mongoose');
var GameModel = mongoose.model('GameModel');
var HighScoreGameModel = mongoose.model('HighScoreGameModel');

module.exports = {

    emailScreenshot: function(gameObj, player) {

        console.log('emailing game ' + gameObj.id + '[' + player + ']');
        this.getScreenshot(gameObj.id, player, function(err, filename) {
            if(err) {
                console.log(err);
                return console.log('problem gettng screenshot');
            }

            console.log('got file ' + filename);
            
            radiant.addParticipation(filename, {
                accessCode: gameObj.players[(player === 'left' ? 0 : 1)].accessCode || 100,
                activityData: JSON.stringify(gameObj.data[player].stepsPerSecond),
                activity: 'cigna'
            }, function(err, data) {
                console.log(err);
                console.log(data);
            })


        })
    },

    getScreenshot: function(game, player, cb) {

        var filename = game + '-' + player + '.jpg';
        filename = path.resolve(__dirname + '/../generated-images/' + filename);
        console.log("filename "+filename);

        var options = {
            screenSize: {
                width: 1500,
                height: 1500
            }
            // phantomPath: '/Users/mathisonian/bin/phantomjs'
        };
        
        webshot('http://localhost:3000/stats/' + game + '/' + player, filename, options, function(err) {
            if(err) {
                console.log(err);
                return cb(err);
            } 

            return cb(null, filename);
        });

    },


    getHighScore: function(cb) {
        HighScoreGameModel
            .find()
            .limit(1)
            .sort('-score')
            .select('player score')
            .exec(function(err, games) {

                if(err) {
                    return cb(err);
                }

                if(games.length) {
                    return cb(null, games[0].score);
                }

                return cb(null, 0);
            });

    }
};


