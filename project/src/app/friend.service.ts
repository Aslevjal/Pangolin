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

  editFriendListNew(data: Friends, id) {
    console.log(data.friends);
    return this.httpClient.post<any>(`${this.API_URL}/newfriends/edit/${id}`, data)
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

  getUser(email) {
    return this.httpClient.get(`${this.API_URL}/user/${email}`, { headers: this.headers }).pipe(
      map((res: any) => {
        return res
      }),
      catchError(this.handleError)
    )
  }


  editNewFriendList(data: any[], id) {
    return this.httpClient.post<any>(`${this.API_URL}/newfriends/edit/${id}`, data)
      .subscribe((res: any) => {
        //this.getUserProfile(res._id).subscribe((res) => {
        this.currentUser = res;
        //})
      })
  }

  delNewFriendList(id) {
    return this.httpClient.post<any>(`${this.API_URL}/newfriends/delete/${id}`, { headers: this.headers })
      .subscribe((res: any) => {
        //this.getUserProfile(res._id).subscribe((res) => {
        this.currentUser = res;
        //})
      })
  }

  getNewFriendList(id) {
    return this.httpClient.get(`${this.API_URL}/newfriends/${id}`, { headers: this.headers }).pipe(
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
