// auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('authResponse');
    localStorage.removeItem('userId'); // Remove userId if needed

    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const storedData = localStorage.getItem('authResponse');
    return !!storedData;
  }
}
