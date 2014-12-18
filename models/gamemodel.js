var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
  date: { type: Date, default: Date.now },
  winner: String,
  topscore: Number,
  players: [{
    firstName: String,
    lastName: String,
    email: String,
    accessCode: String,
    contactMe: Boolean
  }],
  data: {
    left: {
        avgspeed: Number,
        topspeed: Number,
        steps: Array,
        stepsPerSecond: Array
    },
    right: {
        avgspeed: Number,
        topspeed: Number,
        steps: Array,
        stepsPerSecond: Array
    }
  }
});

var GameModel = mongoose.model('GameModel', gameSchema);

