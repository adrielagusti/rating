const cds = require("@sap/cds");
const cov2ap = require("@cap-js-community/odata-v2-adapter");
cds.on("bootstrap", (app) => { 
        app.use(cov2ap());
        app.use(proxy({ path: 'v2', port:8080 , host:'0.0.0.0' }))});
module.exports = cds.server;