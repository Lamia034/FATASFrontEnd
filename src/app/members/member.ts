
export enum IdentityDocumentType {
  CIN = 'CIN',
  CARTE_RESIDENCE = 'CARTE_RESIDENCE',
  PASSPORT = 'PASSPORT'
}
export enum Role{
  ADHERENT = 'ADHERENT',
  MANAGER = 'MANAGER',
  JURY = 'JURY'
}
export enum Activation{
  ENABLED = 'ENABLED',
  DESABLED = 'DESABLED',
}
export interface Member {
  num: number;
  name: string;
  familyName: string;
  accessionDate: Date;
  nationality:string;
  identityDocument:IdentityDocumentType;
  identityNumber:string;
  role:Role;
  activation:Activation;
}
