import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { BaseApiService } from 'src/app/core/services/base-api/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthUserService extends BaseApiService {
  login(email: string, password: string): Observable<any> {
    return this.http.post(
      `api/login`,
      { email, password },
      { withCredentials: true }
    );
  }

  checkSession(): Observable<any> {
    console.log(this.apiUrl);
    return this.http.get('/api/check-session', {
      withCredentials: true,
    });
  }

  addUser(userId: string): Observable<any> {
    return this.http.get(`/getUser/${userId}`);
  }

  logOutUser(): Observable<any> {
    return this.http.post('/logout', {});
  }
}
