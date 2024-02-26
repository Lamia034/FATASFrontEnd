import {Ranking} from "../rankings/ranking";


export interface Competition {
  code: string;
  amount: number;
  date: Date;
  startTime: number;
  endTime:number;
  location:string;
  numberOfParticipants:number;
  rankings: Ranking[];
}
