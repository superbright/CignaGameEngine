var webshot = require('webshot');


module.exports = {

    getScreenshot: function(game, player, cb) {

        var filename = game + '-' + player + '.png';

        var options = {
            screenSize: {
                width: 2083 / 4,
                height: 2083 / 4
            }
        };
        
        webshot('http://localhost:3000/stats', filename, options, function(err) {
            if(err) {
                return cb(err);
            } 

            return cb(null, filename);
        });

    }
};


