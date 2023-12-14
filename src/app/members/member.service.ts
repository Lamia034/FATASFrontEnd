import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import { Member } from './member';


@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiBaseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  public getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiBaseUrl + "/members");
  }

  public deleteMember(memberId: number): Observable<any> {
    console.log('Deleting member with ID:', memberId);
    return this.http.delete<any>(`${this.apiBaseUrl}/members/${memberId}`);
  }

  updateMember(memberId: number, updatedMember: any): Observable<Member> {
    const url = `${this.apiBaseUrl}/members/${memberId}`;
    console.log(updatedMember);
    return this.http.put<Member>(url, updatedMember);
  }
  addMember(addedMember: any): Observable<Member> {
    console.log(addedMember);
    return this.http.post<Member>(`${this.apiBaseUrl}/members`, addedMember);
  }
}
