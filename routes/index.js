var express = require('express');
var router = express.Router();
var utils = require('../utilities');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/countdown', function(req, res) {
  res.render('countdown/ready', { title: 'Express' });
});


router.get('/finishing/:id', function(req, res) {
  res.render('finishing/' + req.params.id, { title: 'Express' });
});

router.get('/starting/:id', function(req, res) {
  res.render('starting/' + req.params.id, { title: 'Express' });
});

// router.get('/:cat/:id', function(req, res) {
//   res.render(req.params.cat + '/' + req.params.id, { title: 'Express' });
// });

router.get('/playground', function(req, res) {
  res.render('playground', { title: 'Express' });
});

router.get('/stats', function(req, res) {
  res.render('stats/index', { title: 'Express' });
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
