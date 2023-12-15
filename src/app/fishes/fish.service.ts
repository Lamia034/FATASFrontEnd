import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import { Fish } from './fish';
import {Competition} from "../competitions/competition";


@Injectable({
  providedIn: 'root'
})
export class FishService {
  private apiBaseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  public getFishes(): Observable<Fish[]> {
    return this.http.get<Fish[]>(this.apiBaseUrl + "/fishes");
  }


  public getFishById(fishId: string): Observable<any> {
    console.log('fetching fish with ID:', fishId);
    return this.http.get<any>(`${this.apiBaseUrl}/fishes/${fishId}`);
  }

}
