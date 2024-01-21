import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthUserService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}
  login(email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/login`,
      { email, password },
      { withCredentials: true }
    );
  }

  checkSession(): Observable<any> {
    return this.http.get(`${this.apiUrl}/check-session`, {
      withCredentials: true,
    });
  }

  addUser(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getUser/${userId}`);
  }

  logOutUser(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }
}
