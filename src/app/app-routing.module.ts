import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CompetitionComponent} from "./competitions/competition.component";
import {MemberComponent} from "./members/member.component";

const routes: Routes = [
  {path:'competitions' , component:CompetitionComponent},
  { path: 'competitions/:competitionId', component: CompetitionComponent },
  {path:'members' , component:MemberComponent},
  { path: 'members/:memberId', component: MemberComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
