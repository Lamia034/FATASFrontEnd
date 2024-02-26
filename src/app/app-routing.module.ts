import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CompetitionComponent} from "./competitions/competition.component";
import {MemberComponent} from "./members/member.component";
import {RankingComponent} from "./rankings/ranking.component";
import {HuntingComponent} from "./huntings/hunting.component";
import {FishComponent} from "./fishes/fish.component";
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./authguard/AuthGuard";
import {LogoutComponent} from "./logout/logout.component";

const routes: Routes = [
  // {path:'competitions' , component:CompetitionComponent},
  { path: 'competitions/:competitionId', component: CompetitionComponent },
  {path:'members' , component:MemberComponent,canActivate: [AuthGuard] , data: { allowedRoles: ['MANAGER'] }},
  { path: 'members/:memberId', component: MemberComponent },
  {path:'rankings' , component:RankingComponent,canActivate: [AuthGuard] , data: { allowedRoles: ['MANAGER','JURY'] }},
  { path: 'rankings/:competitionId', component: RankingComponent },
  {path:'huntings' , component:HuntingComponent,canActivate: [AuthGuard] , data: { allowedRoles: ['MANAGER','JURY'] }},
  { path: 'huntings/:huntingId', component: HuntingComponent },
  {path:'fishs' , component:FishComponent},
  { path: 'fishs/:fishId', component: FishComponent },
  {path:'register' , component:RegisterComponent},
  {path:'login' , component:LoginComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  // {path: 'competitions', component: CompetitionComponent, canActivate: [AuthGuard] },
  {path:'competitions',component:CompetitionComponent,canActivate: [AuthGuard] , data: { allowedRoles: ['MANAGER','ADHERENT','JURY'] }},
  {path:'logout',component:LogoutComponent,canActivate: [AuthGuard] , data: { allowedRoles: ['MANAGER','ADHERENT','JURY'] }},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
