import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {RegisterService} from "./RegisterService";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  // @ts-ignore
  // registerRequest: RegisterRequest = new RegisterRequest();
  registerRequest = {

    name : '',
    familyName:'',
    email:'',
    password:'',
    nationality:''
  }
  constructor(private registrationService: RegisterService, private router: Router) {}

  register(): void {
    this.registrationService.register(this.registerRequest)
      .subscribe(() => {
        this.router.navigate(['/login']);
      }, error => {
        console.error('Registration failed:', error);
      });
  }
}
