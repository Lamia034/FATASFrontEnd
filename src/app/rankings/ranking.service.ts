import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import { Ranking } from './ranking';


@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private apiBaseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  public getRankings(): Observable<Ranking[]> {
    return this.http.get<Ranking[]>(this.apiBaseUrl + "/rankings");
  }
  public getTopThreeCompetitors(competitionCode: string): Observable<any> {
    const url = `${this.apiBaseUrl}/rankings?competitionCode=${competitionCode}`;
    return this.http.get<any>(url);
  }

  public deleteRanking(rankingId: string): Observable<any> {
    console.log('Deleting ranking with ID:', rankingId);
    return this.http.delete<any>(`${this.apiBaseUrl}/rankings/${rankingId}`);
  }

  updateRanking(rankingId: string, updatedRanking: any): Observable<Ranking> {
    const url = `${this.apiBaseUrl}/rankings/${rankingId}`;
    console.log(updatedRanking);
    return this.http.put<Ranking>(url, updatedRanking);
  }
  addRanking(addedRanking: any): Observable<Ranking> {
    console.log(addedRanking);
    return this.http.post<Ranking>(`${this.apiBaseUrl}/rankings`, addedRanking);
  }
}
