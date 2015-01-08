

var webshot = require('webshot');
 
 var options = {
    screenSize: {
        width: 200,
        height: 200
    }
    // phantomPath: '/Users/mathisonian/bin/phantomjs'
};


 webshot('http://localhost:3000/stats/54a97cbc059b34ca862b0083/left', './hello2.jpg', options, function(err) {
    if(err) {
        console.log(err);
        return cb(err);
    } 

  
});