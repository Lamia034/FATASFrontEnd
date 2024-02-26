import { Component } from '@angular/core';
import {LogoutService} from "./LogoutService.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private logoutService: LogoutService) {}

  logout(): void {
    this.logoutService.logout();
  }
}
