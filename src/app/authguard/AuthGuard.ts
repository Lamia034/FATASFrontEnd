import {forwardRef, Inject, Injectable} from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';

import { JwtHelperService } from '@auth0/angular-jwt';
import {LoginService} from "../login/LoginService";
import {AuthResponse} from "../AuthResponse/AuthResponse";
import {UserRole} from "../userRoles/UserRole";
import {LogoutService} from "../navbar/LogoutService.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    @Inject(forwardRef(() => LoginService)) private loginService: LoginService,
    private jwtHelper: JwtHelperService,
    private logoutService : LogoutService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('canActivate is called');
    const allowedRoles = route.data['allowedRoles'];

    // const token = (localStorage.getItem('authResponse') as unknown as AuthResponse)?.token;
    //
    // console.log('Token:', token);
    const token = localStorage.getItem('authResponse');
    console.log('AuthResponse from localStorage:', token);

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const userRoles = decodedToken?.role;
      const userId = decodedToken?.num;

      localStorage.setItem('userId', JSON.stringify({ userId: userId }));
      localStorage.setItem('userRole', JSON.stringify({ userId: userRoles }));

      console.log('Decoded Token:', decodedToken);
      console.log('User Roles:', userRoles);
      console.log('User Id:', userId);

      if (userRoles && allowedRoles.some((role: string) => userRoles.some((userRole: UserRole) => userRole.authority === role.toUpperCase()))) {
        console.log('User has allowed role');
        return true;
      }

      // if (this.logoutService.isAuthenticated()) {
      //   return true;
      // } else {
      //   this.router.navigate(['/login']);
      //   return false;
      // }

    }

    console.log('Redirecting to login');
    return this.router.createUrlTree(['/login']);
  }


  isTokenValid(token: string): boolean {
    try {
      return typeof token === 'string' && !this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      console.error('Error decoding or parsing the token:', error);
      return false;
    }
  }
  checkUserRole(token: string, allowedRoles: string[]): boolean {
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const userRole = decodedToken?.role;

      return userRole && allowedRoles.includes(userRole);
    } catch (error) {
      console.error('Error decoding the token:', error);
      return false;
    }
  }
}

// @Injectable({
//   providedIn: 'root'
// })
// export class PermissionService implements CanActivate {
//
//   constructor(private router: Router) {
//   }
//   canActivate(): boolean {
//     const isLoggedIn = false; // Replace with your actual authentication logic
//
//     if (isLoggedIn) {
//       return true;
//     } else {
//       this.router.navigate(['/login']);
//       return false;
//     }
//   }
//
//   //
//   // canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//   //   const isLoggedIn = true;
//   //
//   //   if (isLoggedIn) {
//   //
//   //     return true;
//   //   } else {
//   //     this.router.navigate(['/login']);
//   //     return false;
//   //   }
//   // }
//
// }
//
//
// // export const AuthGuard: (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => boolean = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
// //   return inject(PermissionService).canActivate(next, state);
// // };
