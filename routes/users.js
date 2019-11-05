var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/berb00', function(req, res, next) {
  res.send('respond by berb00');
});

module.exports = router;
