var webshot = require('webshot');
var radiant = require('./radiant');
var path = require('path');

module.exports = {

    emailScreenshot: function(gameObj, player) {

        console.log('emailing game ' + gameObj.id + '[' + player + ']');
        this.getScreenshot(gameObj.id, player, function(err, filename) {
            if(err) {
                console.log(err);
                return console.log('problem gettng screenshot');
            }

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

        var options = {
            screenSize: {
                width: 1000,
                height: 2000
            }
        };
        
        webshot('http://localhost:3000/stats/' + game + '/' + player, filename, options, function(err) {
            if(err) {
                return cb(err);
            } 

            return cb(null, filename);
        });

    }
};


