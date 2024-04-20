using { managed } from '@sap/cds/common';
namespace blackseeds;

entity Strain : managed {
  key GUID: UUID;
  tagID: String;
  name: String;
  breederName: String;
  ratings: Association to many Rating on ratings.strain = $self;
  // user: Association to User;
  attributes: Association to many Attribute;
  // attributes: Association to many Attribute on attributes.strain = $self;
}

// entity Result {
//   value: Integer;
//   strain: Association to many Strain;
//   ratings: Association to many Rating;
//   user: Association to one User
// }
// @ObjectModel: {
//     entityType: 'SUMMARIZED_RESULTS',
//     entityName: 'SummarizedResults'
// }

// entity SummarizedResult {
//     key user: Association to User;
//     key strain: Association to Strain;
//     valueTotal: Integer;
// }

// annotate SummarizedResults with @Metadata.allowExtensions: true;

// @Consumption.filter: [
//     {
//         qualifier: 'RATINGS',
//         target: 'Ratings',
//         properties: [ 'user', 'strain' ]
//     }
// ]


entity Rating {
  key GUID: UUID;
  value: Integer;
  strain: Association to many Strain;
  attribute: Association to one Attribute;
  user: Association to one User
}

entity Attribute {
  key GUID: UUID;
  description: String;
}

entity User {
  key GUID: UUID;
  name: String;
}
