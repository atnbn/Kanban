import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  protected apiUrl = 'http://localhost:3000/';
  constructor(protected http: HttpClient) {}

  protected get(url: string, options = {}): Observable<any> {
    return this.http
      .get(`${this.apiUrl}${url}`, {
        ...options,
        withCredentials: true,
      })
      .pipe(catchError(this.handleError));
  }

  protected post(url: string, body: any, options = {}): Observable<any> {
    return this.http
      .post(`${this.apiUrl}${url}`, body, { ...options, withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  protected delete(url: string, options = {}): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}${url}`, { ...options, withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  protected put<T>(url: string, body: any, options = {}): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${url}`, body, options);
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}