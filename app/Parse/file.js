const Parse = require('./base').getInstance();
const File = Parse.Object.extend('File');

exports.saveFile = function saveFile(name, mimetype, base64, callback) {
    var file = new Parse.File(name, {base64: base64});
    file.save().then(
        function () {
            var newFile = new File();
            newFile.set('mimetype', mimetype);
            newFile.set('data', file);
            newFile.save(null, {
                success: function(newFile) {
                    return callback(null, toCedarFile(newFile));
                },
                error: function(newFile, err) {
                    return callback(err);
                }
            })
        },
        function (err) {
            return callback(err);
        });
}

function toCedarFile(ParseFile) {
    var file = {
        type: ParseFile.get('mimetype'),
        name: ParseFile.get('data').name(),
        url: ParseFile.get('data').url()
    }

    return file;
}