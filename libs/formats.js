var validator = require("./validator");

exports.email = function (value) {
    if (validator.isEmail(value)) {
        return null;
    }

    return 'E-mail address expected';
};