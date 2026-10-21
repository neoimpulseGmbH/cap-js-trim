const cds = require("@sap/cds");


// Helper function to check if a value should be trimmed
const shouldTrim = (value) => {
    return value && value !== null && typeof value === "string" && value !== "";
};


// Helper function to trim all string fields in data
const trimAllFields = (data) => {
    for (const key in data) {
        if (shouldTrim(data[key])) {
            data[key] = data[key].trim();
        }
    }
};


// Helper function to trim a specific field
const trimField = (data, fieldKey) => {
    if (shouldTrim(data[fieldKey])) {
        data[fieldKey] = data[fieldKey].trim();
    }
};


// Helper function to apply a handler to every entry of a request.
// Since cds 10 bulk inserts via REST arrive as an array in req.data.
const forEachEntry = (req, handler) => {
    if (Array.isArray(req.data)) {
        req.data.forEach(handler);
    } else if (req.data) {
        handler(req.data);
    }
};


// Helper function to register handlers for both entity and drafts
const registerHandler = (srv, entity, handler) => {
    const events = ["CREATE", "UPDATE", "PATCH"];
    srv.before(events, entity, handler);
    if (entity.drafts) {
        srv.before(events, entity.drafts, handler);
    }
};


cds.once("served", () => {
    for (let srv of cds.services) {
        if (!(srv instanceof cds.ApplicationService)) continue;
        for (let entity of srv.entities) {
            if (entity["@cds.trim"]) {
                registerHandler(srv, entity, (req) => forEachEntry(req, trimAllFields));
            } else {
                for (const key in entity.elements) {
                    const element = entity.elements[key];
                    if (element.type === "cds.String" && element["@cds.trim"]) {
                        registerHandler(srv, entity, (req) => forEachEntry(req, (data) => trimField(data, key)));
                    }
                }
            }
        }
    }
});
