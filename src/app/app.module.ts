import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NavbarComponent } from './navbar/navbar.component';
import { CompetitionComponent } from './competitions/competition.component';
import { MemberComponent } from './members/member.component';
import { RankingComponent } from './rankings/ranking.component';
import { HuntingComponent } from './huntings/hunting.component';
import { FishComponent } from './fishes/fish.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CompetitionComponent,
    MemberComponent,
    RankingComponent,
    HuntingComponent,
    FishComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
