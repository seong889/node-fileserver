var express = require('express');
var router = express.Router();
router.get('/', function (req, res, next) {
    req.session['logged'] = false;
    res.writeHead(302, { 'Location': '/login' });
    res.end();
});
module.exports = router;