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
                case when ratings.GUID is not null then true else false end as isRated : Boolean,
                ratings          : redirected to Ratings
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
                user.GUID             as userID,
                user.name             as userName
        } where user.GUID = $user




    entity Attributes as
        projection on blackseeds.Attribute {
            key GUID,
                description
                // case when ratings.value is not null 
        }


    entity Users      as
        projection on blackseeds.User {
            key GUID,
                name
        }


    // entity myStrains {
    //     key GUID    : UUID;
    //         strains : Composition of many {
    //                       key strain  : Association to Strains;
    //                           ratings : Composition of many {
    //                                         key rating : Association to Ratings;
    //                                             user   : Association to Users;
    //                                     }
    //                   }
    // }


}
