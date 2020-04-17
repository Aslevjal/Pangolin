import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { User } from './user';
import { Profile } from './profile';
import { Friends } from './friend'

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  API_URL: string = 'http://localhost:8080/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(private httpClient: HttpClient, public router: Router) { }

  // createProfile(user: User) {

  //   // return this.httpClient.post(`${this.API_URL}/users/register`, user).pipe(
  //   //   catchError(this.handleError)
  //   // )
  //   return this.httpClient.post<any>(`${this.API_URL}/profiles/create`, user)
  //     .subscribe((res: any) => {
  //       //this.getUserProfile(res._id).subscribe((res) => {
  //       this.currentUser = res;
  //       //})
  //     })
  // }
  getAllUser() {
    return this.httpClient.get(`${this.API_URL}/users`, { headers: this.headers }).pipe(
      map((res: any) => {
        return res
      }),
      catchError(this.handleError)
    )
  }

  editFriendList(data: Friends, id) {
    return this.httpClient.post<any>(`${this.API_URL}/friends/edit/${id}`, data)
      .subscribe((res: any) => {
        //this.getUserProfile(res._id).subscribe((res) => {
        this.currentUser = res;
        //})
      })
  }

  delFriendList(id) {
    return this.httpClient.post<any>(`${this.API_URL}/friends/delete/${id}`, { headers: this.headers })
      .subscribe((res: any) => {
        //this.getUserProfile(res._id).subscribe((res) => {
        this.currentUser = res;
        //})
      })
  }

  getFriendList(id) {
    return this.httpClient.get(`${this.API_URL}/friends/${id}`, { headers: this.headers }).pipe(
      map((res: any) => {
        return res
      }),
      catchError(this.handleError)
    )
  }

  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
