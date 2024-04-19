// /* eslint-disable no-constant-condition */
// const { v4: uuidv4 } = require('uuid');
// // const chalk = require('chalk');

// class RatingService {

//     constructor() {

//     }

//     // static getInstance() {
//     //     if (!this.instance) {
//     //         this.instance = new RatingService();
//     //     }
//     //     return this.instance;
//     // }

//     async saveRating(params) {

//         // SQL LOGIC
   
//      // const rating = <Rating> params;
//         const rating = params;

//         rating.ratingID = uuidv4();
//         // rating.attributes = <Attribute>Array ?? or from front?

//         await INSERT(rating).into("blackseeds_Rating");

//         return SELECT.one().from("blackseeds_Rating").where({ ratingID: rating.ratingID });

//     }

//     async readRating(filters) {
    
//     }
// }
