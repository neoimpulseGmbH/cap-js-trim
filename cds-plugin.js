const cds = require("@sap/cds");


// Helper function to check if a value should be trimmed
const shouldTrim = (value) => {
    return value && value !== null && typeof value === "string" && value !== "";
};


// Helper function to trim all string fields in data
const trimAllFields = (req) => {
    for (const key in req.data) {
        if (shouldTrim(req.data[key])) {
            req.data[key] = req.data[key].trim();
        }
    }
};


// Helper function to trim a specific field
const trimField = (req, fieldKey) => {
    if (shouldTrim(req.data[fieldKey])) {
        req.data[fieldKey] = req.data[fieldKey].trim();
    }
};


// Helper function to register handlers for both entity and drafts
const registerHandler = (srv, entity, handler) => {
    const events = ["CREATE", "UPDATE", "PATCH"];
    srv.before(events, entity, handler);
    srv.before(events, entity.drafts, handler);
};


cds.once("served", () => {
    for (let srv of cds.services) {
        if (!(srv instanceof cds.ApplicationService)) continue;
        for (let entity of srv.entities) {
            if (entity["@cds.trim"]) {
                registerHandler(srv, entity, trimAllFields);
            } else {
                for (const key in entity.elements) {
                    const element = entity.elements[key];
                    if (element.type === "cds.String" && element["@cds.trim"]) {
                        registerHandler(srv, entity, (req) => trimField(req, key));
                    }
                }
            }
        }
    }
});
