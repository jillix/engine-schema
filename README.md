# Engine Schema
Schema validation for engine

# Events
 - `schema_valid` - Emited if a schema is valid. The `data` object contains:
 ```js
 {
    data: {...}, // the data object that was validated
    schema: "..." // the name/id of the schema used to validate the data object
 }
 ```
 - `schema_invalid` - Emited if a schema is invalid.
  ```js
 {
    errors: [...], // an array of erros resulted from the validation
    schema: "..." // the name/id of the schema used to validate the data object
 }
 ```
 
 # Usage
#### Schema config
Schemas will be configured in the **composition** of the engine-schema instance. For the client side validation the schemas need to be placed in the `client.config` obejct. For the server side validation the schemas need to be placed in the `config` object.

##### Config options
- `multipleErrors`: if this is set to `true`, the validation will return all errors encountered. By default this is false and the validation will stop after the first error
- `schema`: an object containing all schemas that will be used for validation

##### Example

  ```json
{
    "client": {
        "config": {
            "multipleErrors": true,
            "schema": {
                "someSchemaName/id": {...}
            }
        },
        "flow": []
    },
    "config": {
        "multipleErrors": true, 
        "schema": {
            "someSchemaName/id": {...}
        }
    },
    "roles": {..},
    "module": "engine-schema",
    "name": "..."
}
 ```
 
 ### `validate(data, stream)`
Validates data. The module will write the result and any errors encountered, that are not related to the validation, to the stream.

##### Result example

```javascript
{
    valid: true/false,
    errors: [...] // an array of validation error
}
```

#### Params
- **Object** `data`: The data object:
    - `data` (Object): The object containing the data that will be validated.
    - `schema` (String): The schema name found in the instance config.
    - `callback` (Function): **optional**. A callback function that will be called after the validation finishes. Takes `error, result` as arguments.
- **Stream** `stream`: The stream object.
