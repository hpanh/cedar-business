const _ = require('underscore');

exports.validateImage = function validateImage (fileObject, maximumSizeInByte, validType) {
    var type = fileObject.mimetype;
    var size = fileObject.size;
    var isValid = false;

    if (_.isArray(validType)) {
        for (var i = validType.length - 1; i >= 0; i--) {
            if (type === validType[i]) {
                isValid = true;
            };
        };
    } else if (_.isString(validType)) {
        if (type == validType) {
            isValid = true;
        };
    }

    if (size <= maximumSizeInByte) {
        isValid = true;
    } else {
        isValid = false;
    }

    return isValid;
}
