
using { blackseeds } from '../db/db';

// @(requires: 'authenticated-user')
service BlackSeedsService {

    action broSaveRating(
        strainID: UUID,
        attributeID: UUID,
        comments: String,
        value: Integer
    ) returns Ratings;

   entity Strains as projection on blackseeds.Strain {
        key strainID,
        name
    }

    entity Ratings as projection on blackseeds.Rating{
        key ratingID,
        attributeID,
        strainID,
        ratingValue,
        comments
    }

    entity Attributes as projection on blackseeds.Attribute{
        key attributeID,
        description
    }

}

