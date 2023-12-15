import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import { Competition } from './competition';


@Injectable({
  providedIn: 'root'
})
export class CompetitionService {
  private apiBaseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  // public getCompetitions(): Observable<Competition[]> {
  //   return this.http.get<Competition[]>(this.apiBaseUrl + "/competitions");
  // }

 public  getCompetitions(page: number, size: number): Observable<Competition[]> {
    return this.http.get<Competition[]>(`${this.apiBaseUrl}/competitions?page=${page}&size=${size}`);
  }

  public deleteCompetition(competitionId: string): Observable<any> {
    console.log('Deleting competition with ID:', competitionId);
    return this.http.delete<any>(`${this.apiBaseUrl}/competitions/${competitionId}`);
  }

  updateCompetition(competitionId: string, updatedCompetition: any): Observable<Competition> {
    const url = `${this.apiBaseUrl}/competitions/${competitionId}`;
    console.log(updatedCompetition);
    return this.http.put<Competition>(url, updatedCompetition);
  }
  addCompetition(addedCompetition: any): Observable<Competition> {
    console.log(addedCompetition);
    return this.http.post<Competition>(`${this.apiBaseUrl}/competitions`, addedCompetition);
  }

  // getTotalPages(): Observable<number> {
  //   return this.http.get<number>(`${this.apiBaseUrl}/competitions/count`);
  // }

}
