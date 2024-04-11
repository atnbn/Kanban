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
    this.authService.triggerLoading(true); // Show loading spinner before sending the request
    return this.authService.checkSession().pipe(
      map((authStatus) => {
        this.authService.triggerLoading(false); // Hide loading spinner after receiving the response
        const currentUrl = state.url;
        console.log('Session searching');
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
      }),
      catchError(() => {
        this.authService.triggerLoading(false); // Hide loading spinner in case of error
        return of(false);
      })
    );
  }
}
