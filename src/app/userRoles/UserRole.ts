export enum Role{
  ADHERENT = 'ADHERENT',
  MANAGER = 'MANAGER',
  JURY = 'JURY'
}
export interface UserRole{
  authority :Role,
}
