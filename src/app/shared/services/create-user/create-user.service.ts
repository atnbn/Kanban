import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../models/user-interface';

@Injectable({
  providedIn: 'root',
})
export class CreateUserService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  signUser(user: User): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/sign-user`, user, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          return throwError(() => err.error);
        })
      );
  }

  getData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }
}
