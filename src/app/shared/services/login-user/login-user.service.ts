import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user-interface';

@Injectable({
  providedIn: 'root',
})
export class LoginUserService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // getData(): Observable<any[]> {
  //   return this.http.get<User[]>(`${this.apiUrl}`);
  // }

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, {
      username,
      password,
    });
  }
}
