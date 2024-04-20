using {blackseeds} from '../db/db';

// @(requires: 'authenticated-user')
service BlackSeedsService {

    // action broSaveRating(
    //     strainID: UUID,
    //     attributeID: UUID,
    //     comments: String,
    //     value: Integer
    // ) returns Ratings;

    entity Strains    as
        projection on blackseeds.Strain {
            key GUID,
                tagID,
                name,
                0 as value: Integer,
                // sum(ratings.value) as value     : Integer,
            //     ratings.value,
            // key ratings.user,
            //     ratings        : redirected to Ratings,
        }
        group by
            GUID


    entity Ratings    as
        projection on blackseeds.Rating {
            key GUID,
                @UI.HiddenFilter
                strain,
                attribute,
                @UI.HiddenFilter
                user,
                value,
                attribute.description as attributeDescription,
                strain.name           as strainName,
                user.name             as userName
        }


    entity Attributes as
        projection on blackseeds.Attribute {
            key GUID,
                description
        }


    entity Users      as
        projection on blackseeds.User {
            key GUID,
                name
        }


// entity SummarizedResults as
//     projection on blackseeds.Strain {
//         key GUID,
//         // key Rating.strain,
//         // sum(value) as valueTotal: Integer
//         // sum(value) as valueTotal: Integer,
//     // } group by Rating.user, Rating.strain;
//     }
}
