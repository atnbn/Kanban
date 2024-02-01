import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  TimeoutError,
  catchError,
  throwError,
  timeout,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServerStatusService {
  private _serverStarting = new BehaviorSubject<boolean>(false);
  public readonly serverStarting$ = this._serverStarting.asObservable();

  constructor(
    protected http: HttpClient,
    private serverStatusService: ServerStatusService
  ) {}

  showServerStarting() {
    this._serverStarting.next(true);
  }

  hideServerStarting() {
    this._serverStarting.next(false);
  }

  authUser() {
    this.http
      .get('api/check-session', { withCredentials: true })
      .pipe(
        timeout(5000),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            this.serverStatusService.showServerStarting();
            return throwError(
              () => new Error('The request timed out. Please try again later.')
            );
          }
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (data) => {
          // Handle successful response
          this.serverStatusService.hideServerStarting();
        },
        error: (error) => {
          console.error(error.message);
          // The service already shows the server starting component on error.
        },
      });
  }
}
