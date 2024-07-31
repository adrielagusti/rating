using {
  managed
} from '@sap/cds/common';

namespace blackseeds;

entity Strains {
  key ID          : UUID;
      tagID       : String;
      name        : String;
      breederName : String;
      ratings     : Composition of many Ratings on ratings.strain = $self;

}

entity Ratings : managed {
  key ID        : UUID;
      value     : Integer default 0;
      strain    : Association to Strains;
      attribute : Association to Attributes;
      comments  : String;
}


entity Attributes {
  key ID          : UUID;
      description : String;
      type        : String;
      step        : Integer;
}

entity Specimens : managed  {
  key ID        : UUID;
      strain    : Association to Strains;
      parentID  : UUID;
      clone     : Boolean;
      name      : String;
}

entity Events : managed  {
  key ID          : UUID;
      specimenID  : Association to Specimens;
      eventTypeID : Association to EventTypes;
}

entity EventTypes {
  key ID          : UUID;
      description : String;
}