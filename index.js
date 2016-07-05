var Ajv = require('ajv')
  , libobj = require('libobject')
  , ValidationError = require('./lib/validationError');

/**
 * Validates data based on a JSON schema v4
 *
 * @name validate
 * @function
 * @param {Object} options - Data handler options
 * @param {Object|String} options._.schema - Name of the schema or an object containing the schema (required)
 * @param {String} options._.validate - Validate specific data from the data object
 * @param {Object} data - Data object to be validated (required)
 * @param {Function} next - Data handler next function
 */
exports.validate = function (_options, data, next) {
    var self = this;

    // define default options
    var options = {
        schema: _options._.schema,
        detailedError: _options._.detailedError || false,
        validate: _options._.validate
    };

    if (!options.schema) {
        var error = new ValidationError(500, 'No schema provided.');
        error._ = data;
        return next(error);
    }

    // prepare schema configuration
    if (typeof options.schema === 'string') {
        if (!self._schemas[options.schema]) {
            var error = new ValidationError(500, 'Schema not found in the module config.');
            error._ = data;
            return next(error);
        }
        options.schema = self._schemas[options.schema];
    }

    if (!libobj.isObject(options.schema)) {
        var error = new ValidationError(500, 'Schema is of wrong type.');
        error._ = data;
        return next(error);
    }

    // prepare data
    var dataToValidate = options.validate ? libobj.path(options.validate, data) : data;
    if (!dataToValidate) {
        var error = new ValidationError(500, 'Missing data object');
        error._ = data;
        return next(error);
    }

    // validate
    var valid = self._validator.validate(options.schema, dataToValidate);

    if (valid) {
        return next(null, data);
    } else {
        var errors = self._validator.errorsText().split(', ');
        var error = new ValidationError(400, 'Schema validation failed.', 'validation_error', errors);
        error._ = data;
        return next(error);
    }
};

/**
 *  Initilizes module
 *
 *  @name init
 *  @private
 */
exports.init = function (config, ready) {
    var self = this;

    // init schemas
    self._schemas = self._config.schema;

    // init validator
    self._validator = new Ajv({
        allErrors: config.allErrors || false
    });

    ready();
}