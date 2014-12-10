var express = require('express');
var router = express.Router();
var utils = require('../utilities');
var gameManager = require('../game-manager');
var mongoose = require('mongoose');
var GameModel = mongoose.model('GameModel');


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

router.post('/add-player', function(req, res) {
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


router.get('/stats/:gid/:position', function(req, res) {
  GameModel.findById(req.params.gid, function(err, game) {

    if(err) {
      return res.status(500).send(err);
    }

    if(!game) {
      return res.status(404).send('Could not find game ' + req.params.gid);
    }

    res.render('stats/index', { title: 'Express', game: game, position: req.params.position });
  });
});


router.get('/screenshot', function(req, res) {

    utils.getScreenshot('gameid', 'playerid', function(err, filename) {

        if(err) {
            console.log(err);
            return res.status(500).send('Problem creating screenshot');    
        }
        
        res.status(200).send('OK');
    });

      
});



module.exports = router;
