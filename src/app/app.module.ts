import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NavbarComponent } from './navbar/navbar.component';
import { CompetitionComponent } from './competitions/competition.component';
import { MemberComponent } from './members/member.component';
import { RankingComponent } from './rankings/ranking.component';
import { HuntingComponent } from './huntings/hunting.component';
import { FishComponent } from './fishes/fish.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import {JwtModule, JwtModuleOptions} from "@auth0/angular-jwt";
import {DatePipe} from "@angular/common";
import {AuthResponse} from "./AuthResponse/AuthResponse";
import {AuthInterceptor} from "./interceptor/AuthInterceptor";
import { LogoutComponent } from './logout/logout.component';
export function tokenGetter() {
  const authResponseJson = localStorage.getItem('authResponse');

  if (authResponseJson) {
    const authResponse: AuthResponse = JSON.parse(authResponseJson);
    return authResponse.token || null;
  }

  return null;
}




//
//
// export function getCookie(name: string): string | undefined {
//   const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
//   return cookieValue ? cookieValue.pop(): undefined;
// }
//
// const jwtModuleOptions: JwtModuleOptions = {
//   config: {
//     tokenGetter: tokenGetter,
//   },
// };
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CompetitionComponent,
    MemberComponent,
    RankingComponent,
    HuntingComponent,
    FishComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
      },
    }),
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
