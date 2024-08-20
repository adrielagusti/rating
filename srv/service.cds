using {blackseeds} from '../db/db';

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

    entity Strains        as
        projection on blackseeds.Strains {
            key ID,
                tagID,
                name,
                alias,
                COALESCE(
                    AVG(
                        ratings.value
                    ), 0
                ) as totalPoints : Integer,
        }
        group by
            ID;

    entity Specimens      as
        projection on blackseeds.Specimens {
            key ID,
                parentID,
                name,
                breedType,
                seqNumber,
                tagID,
                plantedDate,
                strain,
                sex,
                state.color       as stateColor,
                state.icon        as stateIcon,
                state.description as stateDescription,
                state,
                strain.ID         as strainID,
                strain.alias      as strainAlias,
                strain.name       as strainName,
                cares,
                waterings,
                MAX(cares.date)   as lastCare : DateTime,
        }
          group by
            ID, strain.name, strain.ID, state.color, state.icon, state.description;
            

    entity Ratings @(restrict: [{
        grant: '*',
        where: 'createdBy = $user'
    }])                   as
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


    entity Attributes     as
        projection on blackseeds.Attributes {
            key ID,
                description,
                type,
                step
        }

    entity Cares          as
        projection on blackseeds.Care {
            key ID,
                specimen,
                careType.name        as careName,
                careType.description as careD,
                careType.calDayType as dayType,
                careType.icon       as icon,
                careType,
                date,
                description
        }


    entity Waterings      as
        projection on blackseeds.Waterings {
            ID,
            specimen,
            specimen.ID as specimenID,
            date,
            liters,
            method
        }

    entity Applications   as
        projection on blackseeds.Applications {
            key ID,
                specimen,
                product,
                product.name as productName,
                date,
                amount,
                method
        }

    entity Photos   as
        projection on blackseeds.Photos {
            key ID,
                specimen,
                date,
                public_id
        }

    entity Products       as
        projection on blackseeds.Products {
            key ID,
                name,
                type,
                description,
                instructions,
                unit,
                0 as amount : Decimal(5, 2)
        }

    entity CareTypes      as
        projection on blackseeds.CareTypes {
            key ID,
                name,
                description
        }

    entity Places         as
        projection on blackseeds.Places {
            key ID,
                description
        }

    entity LifeCycles         as
        projection on blackseeds.LifeCycles {
            key ID,
                days,
                description,
                calDayType,
                sequence
        }

    entity SpecimenStates as
        projection on blackseeds.SpecimenStates {
            key ID,
                description,
                icon,
                color
        }

}
