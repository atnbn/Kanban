import { Injectable } from '@angular/core';
import { AuthUserService } from '../user/login-user/login-user.service';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(private authService: AuthUserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.checkSession().pipe(
      map((authStatus) => {
        const currentUrl = state.url;

        if (authStatus.isLoggedIn) {
          if (currentUrl === '/login' || currentUrl === '/sign-up') {
            this.router.navigate(['/home']);
            return false;
          }
          return true;
        } else {
          if (currentUrl !== '/login' && currentUrl !== '/sign-up') {
            this.router.navigate(['/login']);
            return false;
          }
          return true;
        }
      })
    );
  }
}
