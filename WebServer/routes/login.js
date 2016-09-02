var bcrypt = require('bcrypt');
var express = require('express');
var router = express.Router();

var com = require('../lib/common.js');

//npm "install" "bcrypt@https://github.com/ksmyth/node.bcrypt.js/tarball/v0.8.5" -s

router.get('/', function (req, res, next) {
    res.render('login');
});

router.post('/', function (req, res, next) {
    //var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(com.password, 10);
    if (bcrypt.compareSync(req.param('password', ''), hash))
    {
        req.session['logged'] = true;
        res.writeHead(302, {'Location': '/dirs'});
        res.end();
    }
    else {
        req.session['logged'] = false;
        res.writeHead(302, { 'Location': '/login' });
        res.end();
    }
});
module.exports = router;