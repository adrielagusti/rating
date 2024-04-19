const cds = require('@sap/cds')
// const RatingService = require('./lib/blackseeds-service.js');
// const chalk = require('chalk');

// const dbService = RatingService.getInstance();

//Initialize system
// service.initialize();

module.exports = function () {

    //User OData V2
    const cov2ap = require("@cap-js-community/odata-v2-adapter");
    this.on("bootstrap", (app) => app.use(cov2ap()));

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

}
