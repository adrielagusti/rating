using { managed } from '@sap/cds/common';
namespace blackseeds;

entity Strain {
  key strainID: UUID;
  tagID: String;
  name: String;
  breederName: String;
  ratings: Association to many Rating on ratings.strain = $self;
  attributes: Association to many Attribute on attributes.strain = $self;
}

entity Rating {
  key ratingID: UUID;
  value: Integer;
  strain: Association to one Strain;
  attribute: Association to one Attribute;
  user: Association to one User;
}

entity Attribute {
  key attributeID: UUID;
  description: String;
  strain: Association to many Strain;
  ratings: Association to many Rating on ratings.attribute.attributeID = $self.attributeID;
}

entity User {
  key userID: String;
  name: String;
}

