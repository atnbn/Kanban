import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { BaseApiService } from 'src/app/core/services/base-api/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class ServerStatusService extends BaseApiService {
  checkServerStatus(): Observable<any> {
    return this.get('api/health');
  }
}
