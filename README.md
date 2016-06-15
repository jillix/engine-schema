# Flow Schema
Schema validation for flow


* * *

### validate(options, data, next) 

Validates data based on a JSON schema v4

**Parameters**

**options**: `Object`, Data handler options

**options._.schema**: `Object | String`, Name of the schema or an object containing the schema (required)

**options._.validate**: `String`, Validate specific data from the data object

**data**: `Object`, Data object to be validated (required)

**next**: `function`, Data handler next function


* * *

### Config example
flow-schema module uses [json-schema](http://json-schema.org/documentation.html) for schema validation

```JSON
{   
    ...
    "config": {
        "schema": {
            "SCHEMA_NAME": {
                ...
            }
        }
    }
    ...
}
```

#### Usage example

``` JSON
{
    "flow": {
        "someEvent": {
            "d": [
                ...
                [":flow_schema/validate", {
                    "schema": "SOME_SCHEMA_NAME_OR_OBJECT",
                    "validate": "DOT_NOTATION_DATA_PATH"
                }]
                ...
            ]
        }
    }
}
```

### Error example
The errors returned by the flow-schema module look like this

```javascript
{
    code: SOME_ERROR_CODE // can be 400 or 500,
    message: "ERROR_MESSAGE",
    name: "validation_error",
    errors: [
        "Array of all validation errors
    ]
}
```