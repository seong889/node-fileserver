var mime = require('mime-types');
var express = require('express');
var router = express.Router();
var glob = require('glob');
var fs = require('fs');
var path = require('path');

var com = require('../lib/common');

function make_stat(rpath, tpath, name, alias) {
    var _path = path.join(tpath, name).replace(/\\/g, '/');
    var stats = fs.statSync(path.join(rpath, name));
    var size = stats.size;

    if (size < 1024) size = size + 'B';
    else if (size < 1024 * 1024) size = (size / 1024).toFixed(2) + 'KB';
    else if (size < 1024 * 1024 * 1024) size = (size / 1024 / 1024).toFixed(2) + 'MB';
    else size = (size / 1024 / 1024 / 1024).toFixed(2) + 'GB';

    var isdir = stats.isDirectory()
    var prefix = isdir ? '/dirs' : '/down';

    var mimetype = mime.lookup(_path);
    var type = mimetype ? mimetype.split('/')[0] : 'file';
    if (isdir) type = 'dir';
    return {
        path: _path,
        name: alias || name,
        type: type,
        mime: mimetype,
        size: size,
        date: com.format(stats.mtime, "yyyy-MM-dd hh:mm:ss a/p"),
        dir: isdir,
        prefix: prefix
    };
}
router.get('/*', function (req, res, next) {
    var url = decodeURI(req.url);
    var target_path = com.path_escape(url);
    var real_path = path.join(com.base_path, target_path);
    var dir_name = path.basename(url);
    console.log(real_path);
    fs.readdir(real_path, (err, names) => {
        if (err) return next(err);
            
        var files = [];
        var dirs = [];
        var paths = [];
        var parent_dir = null;
        var p = '/dirs/'

        if (target_path != '/') parent_dir = make_stat(real_path, target_path, '..', 'parent directory');
        console.log(parent_dir)
        target_path.split('/').forEach((val, index, arr) => {
            if (!val) return;
            p = p + val + '/';
            paths.push({ name: val, path: p });
        });
        names.forEach((val, index, arr) => {
            files.push(make_stat(real_path, target_path, val));
        });
        files.sort((a, b) => {
            return (b.dir - a.dir) || (a.name.toUpperCase() - b.name.toUpperCase());
        });
        res.render('dirs', {
            target_path: target_path,
            parent_path: parent_dir,
            paths: paths,
            dirs: dirs,
            files: files
        });
    });
});

module.exports = router;