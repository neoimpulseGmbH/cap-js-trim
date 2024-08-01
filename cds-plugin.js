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
