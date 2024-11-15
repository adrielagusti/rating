using {blackseeds} from '../db/db';

@(requires: 'authenticated-user')

service BlackSeedsService {
    // ENTITY @(restrict: [
    //     { grant: 'READ', to: 'Auditor', where: 'country = $user.country' },
    //     { grant: ['READ','WRITE'], where: 'CreatedBy = $user' },
    //   ]) {/*...*/}

    action changeFavorite(
        ID: String,
    ) returns Specimens;

    action changeTag(
        ID: String,
        tagID: String
    ) returns Specimens;

    entity Strains   as
        projection on blackseeds.Strains {
            key ID,
                tagID,
                name,
                name as strainName,
                alias,
                COALESCE(
                    AVG(
                        ratings.value
                    ), 0
                ) as totalPoints : Integer,
        }
        group by
            ID;

    entity Specimens as
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
                applications,
                photos,
                MAX(
                    cares.date
                )                 as lastCare     : DateTime,
                // SUM(
                //     photos.ID
                // ) as photosNumber : Integer,
                0                 as photosNumber : Integer,
                favorite,
                COALESCE(
                    AVG(
                        ratings.value
                    ), 0
                )                 as totalPoints  : Integer,
        } group by ID, strain.name, strain.ID, state.color, state.icon, state.description;
       
    


entity Ratings @(restrict: [{
    grant: '*',
    where: 'createdBy = $user'
}])                           as
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
            comments,
            specimen.ID  as specimenID,
            specimen.tagID as specimenTag,
            specimen
    }


entity Attributes             as
    projection on blackseeds.Attributes {
        key ID,
            description,
            type,
            step
    }

entity Cares                  as
    projection on blackseeds.Cares {
        key ID,
            specimen,
            careType.name        as careName,
            careType.description as careD,
            careType.calDayType  as dayType,
            careType.icon        as icon,
            careType,
            date,
            description,
            waterings,
            applications
    }


entity Waterings              as
    projection on blackseeds.Waterings {
        ID,
        specimen,
        specimen.ID as specimenID,
        date,
        liters,
        temp,
        ec,
        ph,
        method,
        care
    }

entity Applications           as
    projection on blackseeds.Applications {
        key ID,
            specimen,
            product,
            product.name as productName,
            date,
            amount,
            method,
            care
    }

entity Photos                 as
    projection on blackseeds.Photos {
        key ID,
            specimen,
            specimen.plantedDate,
            date,
            publicId
    }

entity Products               as
    projection on blackseeds.Products {
        key ID,
            name,
            type,
            description,
            instructions,
            unit,
            false as selected : Boolean,
            0     as amount   : Decimal(5, 2)
    }

entity CareTypes              as
    projection on blackseeds.CareTypes {
        key ID,
            name,
            description
    }

entity Places                 as
    projection on blackseeds.Places {
        key ID,
            description
    }

entity LifeCycles             as
    projection on blackseeds.LifeCycles {
        key ID,
            days,
            description,
            calDayType,
            sequence
    }

entity SpecimenStates         as
    projection on blackseeds.SpecimenStates {
        key ID,
            description,
            icon,
            color
    }

entity CompanySpecimensStatus as
    select from SpecimenStates as ST
    left join Specimens as S
        on ST.ID = S.state.ID
    {
        key ST.ID,
            ST.description,
            ST.color,
            ST.icon,
            count(
                S.ID
            ) as numberOf : Integer
    }
    group by
        ST.ID,
        ST.description,
        ST.color,
        ST.icon
    having
        count(
            S.ID
        ) > 0

}
