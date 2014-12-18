var mongoose = require('mongoose');
var path = require('path');
var _ = require('lodash');
var fs = require('fs');
// connect to Mongo when the app initializes
mongoose.connect('mongodb://localhost/dummy');

var utilities = require('./utilities');
// bootstrap the models
fs.readdirSync(__dirname + '/models').forEach(function (file) {
  if (~file.indexOf('.js')) require(__dirname + '/models/' + file);
});

var GameModel = mongoose.model('GameModel');

// var radiant = require('./utilities/radiant');



// radiant.addParticipation(path.resolve('./upload.jpg'), {activity: 'cigna', accessCode: 100, activityData: 'test'})

// radiant.addRegistration(path.resolve('./sig.png'), {});

GameModel
    .find()    
    .limit(1)
    .exec(function(err, gameModels) {

        _.each(gameModels, function(gameModel) {
            utilities.emailScreenshot(gameModel, 'left');
        });
        // console.log(gameModel);
    })
