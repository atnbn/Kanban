import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from '../../../models/user-interface';
import { BaseApiService } from 'src/app/core/services/base-api/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class CreateUserService extends BaseApiService {
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
