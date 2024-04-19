
using { blackseeds } from '../db/db';

// @(requires: 'authenticated-user')
service BlackSeedsService {

    // action broSaveRating(
    //     strainID: UUID,
    //     attributeID: UUID,
    //     comments: String,
    //     value: Integer
    // ) returns Ratings;

   entity Strains as projection on blackseeds.Strain {
        key GUID,
        tagID,
        name,
        sum(ratings.value) as value : Integer,
        ratings: redirected to Ratings,
    } group by GUID
    // group by strainID

    entity Ratings as projection on blackseeds.Rating{
        GUID,
        // attributeID, 
        value,
        strain
    }

    entity Attributes as projection on blackseeds.Attribute{
        key attributeID,
        description,
        // strain
        // value,
        // comments
    }

}

