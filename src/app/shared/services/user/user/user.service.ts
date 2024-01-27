import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from 'src/app/core/services/base-api/base-api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseApiService {
  getUser(): Observable<any> {
    return this.get('api/user-data');
  }

  logout() {
    return this.post('api/logout', {});
  }

  deleteUser() {
    return this.delete('api/delete-user');
  }
}
