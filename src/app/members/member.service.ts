import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import { Member } from './member';
import {Competition} from "../competitions/competition";


@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiBaseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  // public getMembers(): Observable<Member[]> {
  //   return this.http.get<Member[]>(this.apiBaseUrl + "/members");
  // }
  public  getMembers(page: number, size: number): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiBaseUrl}/members?page=${page}&size=${size}`);
  }

  public getMemberById(memberId: number): Observable<any> {
    console.log('fetching member with ID:', memberId);
    return this.http.get<any>(`${this.apiBaseUrl}/members/${memberId}`);
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
