var tv4 = require("./tv4");

function validate (options, callback) {
    var self = this;

    // check data
    if (!options || !options.data || !options.schema) {
        return callback("Data provided not valid");
    }

    // check if the required schema was configured
    if (!self._config || !self._config.schema || !self._config.schema[options.schema]) {
        return callback("Schema not configured");
    }

    // get schema
    var schema = self._config.schema[options.schema];

    // multiple or single error validation
    var multiple = options.multipleErrors || false;

    // validate data
    var result = multiple ? tv4.validateMultiple(options.data, schema) : tv4.validate(options.data, schema);

    if (result.valid || result === true) {
        self.flow("schema_valid").write(null, {
            data: options.data,
            schema: options.schema
        });

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

        self.flow("schema_invalid").write(null, {
            schema: options.schema,
            errors: result.errors
        });

        // send response back
        callback(null, result);
    }
}

exports.validate = function (data, stream) {
    var self = this;

    validate.call(self, data, function (err, result) {

        // look for a callback if provided
        var callback = data.callback || function () {};
        callback(err, result);

        if (err) {
            return stream.write(err);
        }

        // if the result is valid send the data back
        if (result.valid) {
            stream.write(null, data);
        } else {
            stream.write(result.errors);
        }
    });
};