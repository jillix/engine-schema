module.exports = function (validator, data, options, callback) {
    
    // choose validation method
    var method = options.multipleErrors ? "validateMultiple" : "validate";

    // validate data
    var result = validator[method](data, options.schema);

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

        // TODO better errors

        // send response back
        callback(new Error("Engine-Schema.validate: Schema Validation Failed"), result);
    }
}