# CDS Trim Plugin

This plugin for the SAP Cloud Application Programming Model (CAP) automatically trims string attributes. The trim logic is applied based on annotations either on the entire entity or specific attributes.

## Features

-   Automatically trims all string attributes for entities annotated with `@cds.trim`.
-   Trims specific string attributes annotated with `@cds.trim`.

## Installation

To install the plugin, add it to your CAP project.

```sh
npm install cds-trim-plugin
```

## Usage

1. **Annotate Your Model**

    Add the `@cds.trim` annotation to your entities or specific attributes that should be trimmed.

    ```plaintext
    namespace my.bookshop;

    entity Books {
        key ID : Integer;
        title  : String @cds.trim;
        author : String @cds.trim;
    }

    entity Authors @cds.trim {
        key ID : Integer;
        name  : String;
    }
    ```

## How It Works

The plugin scans all services and entities for the `@cds.trim` annotation. If an entity or its attributes are annotated, the plugin will automatically trim whitespace from string attributes before `CREATE`, `UPDATE`, and `PATCH` operations.

```javascript
const cds = require("@sap/cds");

cds.once("served", () => {
    for (let srv of cds.services) {
        if (!(srv instanceof cds.ApplicationService)) continue;
        for (let entity of srv.entities) {
            if (entity["@cds.trim"]) {
                srv.before(["CREATE", "UPDATE", "PATCH"], entity, (req) => {
                    for (const key in req.data) {
                        if (
                            req.data[key] &&
                            req.data[key] !== null &&
                            typeof req.data[key] === "string" &&
                            req.data[key] !== ""
                        ) {
                            req.data[key] = req.data[key].trim();
                        }
                    }
                });
            } else {
                for (const key in entity.elements) {
                    const element = entity.elements[key];
                    if (element.type === "cds.String" && element["@cds.trim"]) {
                        srv.before(["CREATE", "UPDATE", "PATCH"], entity, (req) => {
                            if (req.data[key] && typeof req.data[key] === "string" && req.data[key] !== "") {
                                req.data[key] = req.data[key].trim();
                            }
                        });
                    }
                }
            }
        }
    }
});
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

Thanks to the SAP CAP community for their support and contributions.
