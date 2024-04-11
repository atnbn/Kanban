import { Injectable } from '@angular/core';
import { AuthUserService } from '../user/login-user/login-user.service';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, catchError, finalize, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  loading: boolean = false;
  constructor(private authService: AuthUserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    this.authService.triggerLoading(true);
    return this.authService.checkSession().pipe(
      map((authStatus) => {
        this.authService.triggerLoading(false);
        const currentUrl = state.url;
        console.log('Session searching');
        if (authStatus.isLoggedIn) {
          if (currentUrl === '/login' || currentUrl === '/sign-up') {
            this.router.navigate(['/home']);
            this.authService.triggerLoading(false);
            return false;
          }
          return true;
        } else {
          if (currentUrl !== '/login' && currentUrl !== '/sign-up') {
            this.router.navigate(['/login']);
            this.authService.triggerLoading(false);
            return false;
          }
          return true;
        }
      }),
      catchError(() => {
        return of(false);
      })
    );
  }
}
