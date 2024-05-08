import fetch from "node-fetch";
// const cds = require("@sap/cds");
// const cov2ap = require("@cap-js-community/odata-v2-adapter");
// cds.on("bootstrap", (app) => app.use(cov2ap()));
// module.exports = cds.server;


// const express = require("express");
// const cds = require("@sap/cds");
// const proxy = require("@sap/cds-odata-v2-adapter-proxy");

// const host = "0.0.0.0";
// const port = process.env.PORT || 4004;

// (async () => {
//   const app = express();

//   // OData V2
//   app.use(proxy());

//   // OData V4
//   await cds.connect.to("db");
//   await cds.serve("all").in(app);

//   const server = app.listen(port, host, () => console.info(`app is listing at ${host}:${port}`));
//   server.on("error", error => console.error(error.stack));
// })();