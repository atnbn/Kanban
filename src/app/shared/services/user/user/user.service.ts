import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from 'src/app/core/services/base-api/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseApiService {
  getUserData(): Observable<any> {
    return this.get('api/user-data');
  }
}
