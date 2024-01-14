import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../../../models/user-interface';

@Injectable({
  providedIn: 'root',
})
export class CreateUserService {
  private apiUrl = 'http://localhost:3000/api/sign-user';

  constructor(private http: HttpClient) {}

  signUser(user: User): Observable<any> {
    return this.http
      .post(this.apiUrl, user, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((err) => {
          return throwError(() => err.error);
        })
      );
  }
}
