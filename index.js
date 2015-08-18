var tv4 = require("./tv4");

exports.validate = function (data) {
    var self = this;

    // check data
    if (!data || !data.data || !data.schema) {
        return console.error("Data provided not valid");
    }

    // check if the required schema was configured
    if (!self._config || !self._config.schema || !self._config.schema[data.schema]) {
        return console.error("Schema not configured");
    }

    // look for a callback
    var callback = data.callback || function () {};

    // validate data
    var schema = self._config.schema[data.schema];
    var valid = tv4.validate(data.data, schema);

    if (valid) {
        self.flow("schema_valid").write(null, {
            data: data.data,
            schema: data.schema
        });

        // send response back via callback
        callback(true);
    } else {
        var error = tv4.error;
        self.flow("schema_invalid").write(null, {
            schema: data.schema,
            error: error
        });

        // send response back via callback
        callback(false, error);
    }
};