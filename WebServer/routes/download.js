var express = require('express');
var mime = require('mime-types');
var path = require('path');
var fs = require('fs');

var com = require('../lib/common');

var router = express.Router();

router.get('/*', (req, res, next) => {
    
    var url = decodeURI(req.url);
    var target_path = com.path_escape(url);
    var real_path = path.join(com.base_path, target_path);
    var filename = path.basename(req.url)
    var mimetype = mime.lookup(real_path);
    console.log(real_path)
    var stat = fs.statSync(path.join(real_path))
    if (stat.isDirectory()) {
        err = Error(`Can't download, because '${url}' is directory`);
        err.status = 500;
        return next(err);
    }
    if (req.headers['range']) {
        var range = req.headers.range;
        var parts = range.replace(/bytes=/, "").split("-");
        var partialstart = parts[0];
        var partialend = parts[1];

        var start = parseInt(partialstart, 10);
        var end = partialend ? parseInt(partialend, 10) : stat.size - 1;
        var chunksize = (end - start) + 1;

        var file = fs.createReadStream(real_path, { start: start, end: end });
        res.status(206);
        res.setHeader('Content-Range', 'bytes ' + start + '-' + end + '/' + stat.size);
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Content-Length', chunksize);
        res.setHeader('Content-Type', mimetype);
        file.pipe(res);
    }
    else {
        res.setHeader('Content-disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-type', mimetype);
        res.setHeader('Content-Length', stat.size);
        var filestream = fs.createReadStream(real_path);
        filestream.pipe(res);
    }


});

module.exports = router;