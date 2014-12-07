const Parse = require('./base').getInstance();
const Image = Parse.Object.extend('Image');

exports.saveImage = function saveImage(name, mimetype, base64, callback) {
    var file = new Parse.File(name, {base64: base64});
    file.save().then(
        function () {
            var newImage = new Image();
            newImage.set('mimetype', mimetype);
            newImage.set('data', file);
            newImage.save(null, {
                success: function(newImage) {
                    return callback(null, newImage);
                },
                error: function(newImage, err) {
                    return callback(err);
                }
            })
        },
        function (err) {
            return callback(err);
        });
}
