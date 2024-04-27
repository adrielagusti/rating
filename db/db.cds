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
}


entity Attributes {
  key ID          : UUID;
      description : String;
}

// entity temporalMain : temporal {/*...*/
//   user : Association to User;
//   strains: Association to Strain;
//   ratings : Association to Rating on ratings.user.userID = user.userID;
// }

// /** Hierarchically organized Code List for Genres */
// entity Genres : sap.common.CodeList {
//   key ID   : Integer;
//   parent   : Association to Genres;
//   children : Composition of many Genres on children.parent = $self;
// }
