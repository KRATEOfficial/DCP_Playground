var express = require('express');
var router = express.Router();
var path = require('path');
const mainDir = process.cwd();


/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render(__dirname + '/index.html'); //, { title: 'Express' }
  //res.send(__dirname + 'index.html');
  res.sendFile(path.join(mainDir + '/public/html/index.html'));
});

module.exports = router;
