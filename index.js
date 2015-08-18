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

    // validate data
    var schema = self._config.schema[data.schema];
    var valid = tv4.validate(data.data, schema);

    if (valid) {
        self.flow("schema_valid").write(null, {
            data: data.data,
            schema: data.schema
        });

        // send response back
        callback(null, {
            valid: true
        });
    } else {
        var error = tv4.error;
        self.flow("schema_invalid").write(null, {
            schema: data.schema,
            error: error
        });

        // send response back
        callback(null, {
            valid: false,
            error: error
        });
    }
}

exports.validate = function (data, stream) {
    var self = this;

    validate.call(self, data, function (err, response) {

        // look for a callback if provided
        var callback = data.callback || function () {};
        callback(err, response);

        // write response to stream
        if (stream) {
            stream.write(err, response);
        }
    });
};