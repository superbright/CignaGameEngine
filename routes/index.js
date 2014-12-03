var express = require('express');
var router = express.Router();

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

router.get('/playground', function(req, res) {
  res.render('playground', { title: 'Express' });
});

module.exports = router;
