import { Component } from '@angular/core';
import {LoginService} from "./LoginService";
import {Router} from "@angular/router";
import {AuthResponse} from "../AuthResponse/AuthResponse";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // @ts-ignore
  // registerRequest: RegisterRequest = new RegisterRequest();
  loginRequest = {
    email:'',
    password:''
  }
  constructor(private loginService: LoginService, private router: Router) {}

  login(): void {
    this.loginService.login(this.loginRequest)
      .subscribe(
        (authResponse: AuthResponse) => {
          console.log('Login successful:', authResponse);
         localStorage.setItem('authResponse', authResponse.token);

          const token = authResponse.token;

          console.log('Local Storage:', localStorage);
          console.log('Token:', token);

          this.router.navigate(['/competitions']);
          console.log();
        }, error => {
          console.error('Login failed:', error);
        });
  }
}

