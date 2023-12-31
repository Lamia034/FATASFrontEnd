import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import { Hunting } from './hunting';


@Injectable({
  providedIn: 'root'
})
export class HuntingService {
  private apiBaseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  addHunting(addedHunting: any): Observable<Hunting> {
    console.log(addedHunting);
    return this.http.post<Hunting>(`${this.apiBaseUrl}/huntings`, addedHunting);
  }

}
