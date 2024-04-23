using { managed } from '@sap/cds/common';
namespace blackseeds;

entity Strain : managed {
  key GUID: UUID;
  tagID: String;
  name: String;
  breederName: String;
  ratings: Association to many Rating on ratings.strain = $self;
  // attributes: Association to many Attribute;
}

entity Rating {
  key GUID: UUID;
  value: Integer;
  strain: Association to one Strain;
  attribute: Association to one Attribute;
  user: Association to one User
}

entity Attribute {
  key GUID: UUID;
  description: String;
  ratings: Association to many Rating on ratings.attribute.GUID = $self.GUID;
}

entity User {
  key GUID: UUID;
  name: String;
}

