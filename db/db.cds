using {
  managed
} from '@sap/cds/common';

namespace blackseeds;

entity Strains {
  key ID          : UUID;
      tagID       : String;
      name        : String;
      alias       : String;
      ratings     : Composition of many Ratings on ratings.strain = $self; // Cant live without Strain

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


//  Collection 
entity Specimens : managed {
  key ID          : UUID;
      parentID    : UUID;
      breedType   : String;
      seqNumber   : Integer;
      strain      : Association to Strains;
      name        : String;
      tagID       : String;
      plantedDate : DateTime;
      place       : Association to Places;
      state       : Association to SpecimenStates;
      sex         : String(1) default 'F';
      
      cares       : Composition of many Care on cares.specimen = $self;
      waterings   : Composition of many Waterings on waterings.specimen = $self;
      photos      : Composition of many Photos on photos.specimen = $self;
}

entity Care : managed  {
  key ID          : UUID;
      specimen    : Association to Specimens;
      careType    : Association to CareTypes;
      date        : DateTime;
      description : String;
}

entity Waterings : managed  {
  key ID          : UUID;
      specimen    : Association to Specimens;
      date        : DateTime;
      liters      : Decimal(6,2);
      ph          : Decimal(6,2);
      ec          : Decimal(6,2);
      temp        : Decimal(6,2);
      method      : String;
}

entity Applications : managed {
  key ID          : UUID;
      specimen    : Association to Specimens;
      product     : Association to Products;
      date        : DateTime;
      amount      : Decimal(6,2);
      method      : String; //Spraying, water
}

entity Photos : managed {
  key ID          : UUID;
      specimen    : Association to Specimens;
      date        : DateTime;
      publicId    : String;
}

entity Products {
  key ID          : UUID;
      name        : String;
      type        : String; //Fertilizer / Pesticide
      description : String;
      instructions: String;
      unit        : String;
}

entity CareTypes {
  key ID          : UUID;
      name        : String;
      description : String; // watering, fertilizing, pruning, etc
      calDayType  : String; 
      icon        : String;
}

entity Places {
  key ID          : UUID;
      description : String;
}

entity LifeCycles {
  key ID            : UUID;
      days          : Integer;
      specimenType  : String;
      breedType     : String;
      sequence      : String;
      description   : String; // Vegetation floration
      calDayType    : String; 
}

entity SpecimenStates {
  key ID          : UUID;
      description : String; // Dead , alive, sick
      icon        : String;
      color       : String;
}
