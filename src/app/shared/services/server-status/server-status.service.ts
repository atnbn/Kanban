import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  of,
  throwError,
  timeout,
} from 'rxjs';
import { BaseApiService } from 'src/app/core/services/base-api/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class ServerStatusService extends BaseApiService {
  checkServerStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}api/health`).pipe(
      timeout(5000),
      catchError((error) => {
        console.error(error);

        throw error;
      })
    );
  }
}
