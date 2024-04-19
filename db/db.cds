using { managed } from '@sap/cds/common';
namespace blackseeds;

entity Strain : managed {
  key GUID: UUID;
  tagID: String;
  name: String;
  breederName: String;
  ratings: Association to many Rating on ratings.strain = $self;
  // attributes: Association to many Attribute on attributes.strain = $self;
}

entity Rating {
  key GUID: UUID;
  value: Integer;
  strain: Association to many Strain;
}

entity Attribute {
  key attributeID: UUID;
  description: String;
}