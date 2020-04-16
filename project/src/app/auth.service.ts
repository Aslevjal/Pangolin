import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { User } from './user';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  API_URL: string = 'http://localhost:8080/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(private httpClient: HttpClient, public router: Router) { }

  register(user: User) {

    // return this.httpClient.post(`${this.API_URL}/users/register`, user).pipe(
    //   catchError(this.handleError)
    // )
    return this.httpClient.post<any>(`${this.API_URL}/users/register`, user)
      .subscribe((res: any) => {
        localStorage.setItem('userId', res._id)
        //this.getUserProfile(res._id).subscribe((res) => {
          this.currentUser = res;
          this.router.navigate(['profile']);
        //})
      })
  }

  login(user: User) {
    return this.httpClient.post<any>(`${this.API_URL}/users/login`, user)
      .subscribe((res: any) => {
        localStorage.setItem('userId', res._id)
        //this.getUserProfile(res._id).subscribe((res) => {
          this.currentUser = res;
          this.router.navigate(['profile']);
        //})
      })
  }

  getUserId() {
    return localStorage.getItem('userId');
  }

  isLoggedIn(): boolean {
    let authToken = localStorage.getItem('userId');
    return (authToken !== null) ? true : false;
  }

  logout() {
    if (localStorage.removeItem('userId') == null) {
      this.router.navigate(['login']);
    }
  }

  getUser(id) {
    return this.httpClient.get(`${this.API_URL}/users/${id}`, { headers: this.headers }).pipe(
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