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
            key strainID,
                tagID,
                name,
                case when ratings.ratingID is not null then true else false end as isRated : Boolean,
                ratings          : redirected to Ratings
        } 
        // group by
        //     GUID


    entity Ratings    as
        projection on blackseeds.Rating {
            key ratingID,
                @UI.HiddenFilter
                strain: redirected to Strains,
                attribute,
                @UI.HiddenFilter
                user,
                value,
                attribute.description as attributeDescription,
                strain.name           as strainName,
                user.userID,
                user.name             as userName
        } where user.userID = $user
        // group by GUID

    entity Attributes as
        projection on blackseeds.Attribute {
            key attributeID,
                // case when ratings.GUID is not null then ratings.GUID else null end as ratingID: UUID,
                description,
                ratings.user.name,
                case when ratings.value is not null then ratings.value else 0 end as value: Integer,
                ratings: redirected to Ratings
        } where ratings.user.userID = $user 


    entity Users      as
        projection on blackseeds.User {
            key userID,
                name
        }

}
