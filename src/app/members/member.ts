
export enum IdentityDocumentType {
  CIN = 'CIN',
  CARTE_RESIDENCE = 'CARTE_RESIDENCE',
  PASSPORT = 'PASSPORT'
}
export interface Member {
  num: number;
  name: string;
  familyName: string;
  accessionDate: Date;
  nationality:string;
  identityDocument:IdentityDocumentType;
  identityNumber:string;
}
