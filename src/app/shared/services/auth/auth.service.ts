import { Injectable } from '@angular/core';
import { LoginUserService } from '../user/login-user/login-user.service';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private loginService: LoginUserService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.loginService.checkSession().pipe(
      map((authStatus) => {
        if (!authStatus.isLoggedIn) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
