var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var highScoreGameSchema = new Schema({
  date: { type: Date, default: Date.now },
  score: Number,
  player: {
    firstName: String,
    lastName: String
  }
});

var HighScoreGameModel = mongoose.model('HighScoreGameModel', highScoreGameSchema);

