var tv4 = require("./libs/tv4");
var formats = require("./libs/formats.js");

function validate (options, callback) {
    var self = this;

    // check data
    if (!options || !options.data || !options.schema) {
        return callback("Data provided not valid");
    }

    if (typeof options.schema === "string") {
        // check if the required schema was configured
        if (!self._config || !self._config.schema || !self._config.schema[options.schema]) {
            return callback("Schema not configured");
        }

        var schema = self._config.schema[options.schema];  
    } else {
        var schema = options.schema;
    }

    // multiple or single error validation
    var multiple = options.multipleErrors || false;

    // validate data
    var result = multiple ? tv4.validateMultiple(options.data, schema) : tv4.validate(options.data, schema);

    if (result.valid || result === true) {
        if (typeof result !== "object") {
            result = {
                valid: result
            }
        }

        // send response back
        callback(null, result);
    } else {

        // build result based on validation type
        if (typeof result !== "object") {
            result = {
                valid: result,
                errors: [tv4.error]
            }
        }

        // send response back
        callback(null, result);
    }
}

exports.validate = function (_options, data, next) {
    var self = this;

    validate.call(self, data, function (err, result) {

        if (err) {
            //TODO better error messages
            return next(new Error(err));
        }

        return next(null, result)
    });
};

exports.init = function (config, reaady) {
    var self = this;

    // add validation formats
    tv4.addFormat({
        "email": formats.email
    });
}