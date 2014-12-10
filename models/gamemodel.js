var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
  date: { type: Date, default: Date.now },
  data: {
    left: {
        avgspeed: Number,
        topspeed: Number,
        steps: Array
    },
    right: {
        avgspeed: Number,
        topspeed: Number,
        steps: Array
    }
  }
});

var GameModel = mongoose.model('GameModel', gameSchema);