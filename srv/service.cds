using { blackseeds } from '../db/db';
@(requires: 'authenticated-user')

service BlackSeedsService {
    // ENTITY @(restrict: [
    //     { grant: 'READ', to: 'Auditor', where: 'country = $user.country' },
    //     { grant: ['READ','WRITE'], where: 'CreatedBy = $user' },
    //   ]) {/*...*/}

    // action broSaveRating(
    //     strainID: UUID,
    //     attributeID: UUID,
    //     comments: String,
    //     value: Integer
    // ) returns Ratings;


    // entity MAINER SELECT blackseeds.temporalMain as{
    //     key user.userID : UUID,
    //     strains.strainID : UUID,
    //     ratings.ratingID : UUID
    // }

    entity Strains    as
        projection on blackseeds.Strains {
            key ID,
                tagID,
                name,
                COALESCE(
                    AVG(
                        ratings.value
                    ), 0
                ) as totalPoints : Integer,
        }
        group by
            ID;


    entity Ratings @(restrict: [{
        grant: '*',
        where: 'createdBy = $user'
    }
    ])
    as
        projection on blackseeds.Ratings {
            key ID,
                strain.ID    as strainID,
                value,
                strain.name  as strainName,
                attribute.ID as attributeID,
                attribute.description,
                attribute.type,
                attribute.step,
                strain,
                strain.tagID,
                attribute,
                createdBy,
                createdAt,
                modifiedAt,
                comments
        }


    entity Attributes as
        projection on blackseeds.Attributes {
            key ID,
                description,
                type,
                step
        }


}
