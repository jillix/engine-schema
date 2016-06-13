function ValidationError (code, message, name, errors) {
    this.code = code;
    this.message = message || '';
    this.stack = (new Error()).stack;
    this.name = name || 'validation_error';
    this.errors = errors || null;
};
ValidationError.prototype = Error.prototype;

module.exports = ValidationError;