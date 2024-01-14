import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeServiceService {
  apiUrl = 'http://localhost:3000/api';
  userObject: string = '';
  constructor(private http: HttpClient) {}

  setUserId(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getUser/${userId}`);
  }
}
