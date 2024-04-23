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
                0 as value : Integer,
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
        
}
