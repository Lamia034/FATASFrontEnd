import { Component } from '@angular/core';
import {LogoutService} from "../navbar/LogoutService.service";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  // constructor(private logoutService: LogoutService) {}
  //
  // logout(): void {
  //   this.logoutService.logout();
  // }
}
