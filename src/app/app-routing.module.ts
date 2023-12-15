import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CompetitionComponent} from "./competitions/competition.component";
import {MemberComponent} from "./members/member.component";
import {RankingComponent} from "./rankings/ranking.component";
import {HuntingComponent} from "./huntings/hunting.component";
import {FishComponent} from "./fishes/fish.component";

const routes: Routes = [
  {path:'competitions' , component:CompetitionComponent},
  { path: 'competitions/:competitionId', component: CompetitionComponent },
  {path:'members' , component:MemberComponent},
  { path: 'members/:memberId', component: MemberComponent },
  {path:'rankings' , component:RankingComponent},
  { path: 'rankings/:rankingId', component: RankingComponent },
  {path:'huntings' , component:HuntingComponent},
  { path: 'huntings/:huntingId', component: HuntingComponent },
  {path:'fishs' , component:FishComponent},
  { path: 'fishs/:fishId', component: FishComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
