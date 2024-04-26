import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseApiService } from 'src/app/core/services/base-api/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthUserService extends BaseApiService {
  private _loading = new BehaviorSubject<boolean>(false);
  loading$ = this._loading.asObservable();

  login(email: string, password: string): Observable<any> {
    return this.post(
      `api/login`,
      { email, password },
      { withCredentials: true }
    );
  }

  checkSession(): Observable<any> {
    return this.get('api/check-session', {
      withCredentials: true,
    });
  }

  addUser(userId: string): Observable<any> {
    return this.get(`api/getUser/${userId}`);
  }

  logOutUser(): Observable<any> {
    return this.post('api/logout', {});
  }

  triggerLoading(state: boolean) {
    this._loading.next(state);
  }
}
