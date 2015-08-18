var tv4 = require("./tv4");

function validate (data, callback) {
    var self = this;

    // check data
    if (!data || !data.data || !data.schema) {
        return callback("Data provided not valid");
    }

    // check if the required schema was configured
    if (!self._config || !self._config.schema || !self._config.schema[data.schema]) {
        return callback("Schema not configured");
    }

    // get schema
    var schema = self._config.schema[data.schema];

    // multiple or single error validation
    var multiple = self._config.multipleErrors || false;

    // validate data
    var result = multiple ? tv4.validateMultiple(data.data, schema) : tv4.validate(data.data, schema);

    if (result.valid || result === true) {
        self.flow("schema_valid").write(null, {
            data: data.data,
            schema: data.schema
        });

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
            schema: data.schema,
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

        // write response to stream
        if (stream) {
            stream.write(err, result);
        }
    });
};