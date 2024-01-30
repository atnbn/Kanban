import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from 'src/app/core/services/base-api/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class HomeServiceService extends BaseApiService {
  userObject: string = '';

  setUserId(userId: string): Observable<any> {
    return this.http.get(`api/getUser/${userId}`);
  }
}
