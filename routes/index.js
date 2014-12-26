var express = require('express');
var router = express.Router();
var utils = require('../utilities');
var gameManager = require('../game-manager');
var mongoose = require('mongoose');
var GameModel = mongoose.model('GameModel');
var HighScoreGameModel = mongoose.model('HighScoreGameModel');
var _ = require('lodash');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('choose-side', { title: 'Express' });
});

router.get('/left', function(req, res) {
  res.render('index', { title: 'Express', position: 'left' });
});

router.get('/right', function(req, res) {
  res.render('index', { title: 'Express', position: 'right' });
});


router.get('/refresh', function(req, res) {
  _.each(req.app.get('ios'), function(nsp) {
    nsp.emit('refresh');
  })
  res.status(200).send();
});


router.post('/add-player', function(req, res) {

  console.log('adding player');
  console.log(req.body.player);
  gameManager.addPlayer(req.body.player);
  res.status(200).send();
});

router.post('/start-game', function(req, res) {
  gameManager.startGame();
  res.status(200).send();
});

router.post('/clear-players', function(req, res) {
  gameManager.clearPlayers();
  res.status(200).send();
});

router.get('/top-scores', function(req, res) {
  
  HighScoreGameModel
    .find()
    .limit(75)
    .sort('-score')
    .select('player score')
    .exec(function(err, games) {
      console.log(games)
      res.json(games);
    });
});

router.get('/playground', function(req, res) {
    res.render('playground', { title: 'Express' });
});


router.get('/stats/', function(req, res) {
  res.render('stats/index', { title: 'Express'});
});

router.get('/stats/:gid/:position', function(req, res) {

    utils.getHighScore(function(err, highScore) {
        GameModel.findById(req.params.gid, function(err, game) {
            if(err) {
                return res.status(500).send(err);
            }

            if(!game) {
              // return res.status(404).send('Could not find game ' + req.params.gid);
                  return res.render('stats/index', { title: 'Express'});
            }

            var position = req.params.position
            var myScore = game.data[position].steps.length;
            res.render('stats/index', { title: 'Express', game: game, position: position, highScore: highScore, myScore: myScore });
        });        
    })

});


router.get('/screenshot/:gid/:position', function(req, res) {

    utils.getScreenshot(req.params.gid, req.params.position, function(err, filename) {

        if(err) {
            console.log(err);
            return res.status(500).send('Problem creating screenshot');    
        }
        
        res.status(200).send('OK');
    });

      
});


module.exports = router;
