
const express = require("express");
const cds = require("@sap/cds");
const proxy = require("@sap/cds-odata-v2-adapter-proxy");

const host = "0.0.0.0";
const port = process.env.PORT || 4004;

(async () => {
  const app = express();

  // OData V2
  app.use(proxy());
  console.info('llegamo');
  // OData V4
//   await cds.connect.to("db");
//   await cds.serve("all").in(app);

//   const server = app.listen(port, host, () => console.info(`app is listing at ${host}:${port}`));
//   server.on("error", error => console.error(error.stack));
})();

// const cds = require("@sap/cds");
// const cov2ap = require("@cap-js-community/odata-v2-adapter");
// cds.on("bootstrap", (app) => app.use(cov2ap()));
// module.exports = cds.server;
// const cds = require('@sap/cds')
// const RatingService = require('./lib/blackseeds-service.js');
// const chalk = require('chalk');

// const dbService = RatingService.getInstance();

//Initialize system
// service.initialize();

// module.exports = function () {

    //User OData V2
    // const cov2ap = require("@cap-js-community/odata-v2-adapter");
    // this.on("bootstrap", (app) => app.use(cov2ap()));

    // this.on('broSaveRating', async req => {

    //     const ratingParams = req.data;

    //     let process = cds.spawn({}, async () => {
    //         dbService.saveRating(ratingParams)
    //     })

    //     // process.on('succeeded',() => chalk.green(`COOOL`) )
    //     // process.on('done',() => chalk.green(`COOOL`) )
    //     // process.on('failed',() => chalk.red(`NOTCOOOL`) )

    // })

    //
    // AFTER READ Rating o Ratings?
    //
    // this.after("READ", "Strain", async () => {

    //     return ''

    // })

// }
