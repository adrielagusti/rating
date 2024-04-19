using { managed } from '@sap/cds/common';
namespace blackseeds;

entity Strain {
  key strainID: UUID;
  tagID: String;
  name: String;
  breederName: String;
}

entity Rating : managed {
  key ratingID: UUID;
  attributeID: UUID;
  strainID: UUID;
  comments: String;
  ratingValue: Integer;
}

entity Attribute {
  key attributeID: UUID;
  description: String;
}