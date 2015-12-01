var tv4 = require('tv4');
var formats = require('tv4-formats');
var validate = require('./lib/validate');
var defaultOptions = {
    validate: {
        schema: null,
        multipleErrors: false
    }
};

function validateDefOptions (options, data) {
    var defOptions = {};
    options = options || {};
    data = data || {};

    Object.keys(defaultOptions['validate']).forEach(function (option) {
        defOptions[option] = (options[option] || data[option]) || defaultOptions['validate'][option];
    });

    return defOptions;
};


exports.validate = function (_options, data, next) {
    var self = this;

    // define the validate options
    var options = validateDefOptions(_options, data);
    var data = _options.data || data.data;

    // check if options provided are valid
    if (!options.schema) {
        return next(new Error('Engine-Schema.validate: No schema provided.'));
    }

    // check if data was provided
    if (!data) {
        return next(new Error('Engine-Schema.validate: No data provided.'));
    }

    // fetch schema
    if (typeof options.schema === 'string') {

        if (!self._schemas[options.schema]) {
            return next(new Error('Engine-Schema.validate: Schema "' + options.schema + '" not found.'));
        }

        options.schema = self._schemas[options.schema];
    }

    // schema must be an object
    if (typeof options.schema !== 'object' || options.schema instanceof Array) {
        return next(new Error('Engine-Schema.validate: Schema must be an object'));
    }

    // validate the data
    validate(tv4, data, options, function (err, result) {

        if (err) {
            return next(err, result || null);
        }

        next(null, result);
    });
};

exports.init = function (config, ready) {
    var self = this;

    // init schemas
    self._config = self._config || {};
    self._schemas = self._config.schema;

    // add validation formats
    tv4.addFormat(formats);

    ready();
}