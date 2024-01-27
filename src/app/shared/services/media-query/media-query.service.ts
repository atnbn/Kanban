import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaQueryService {
  private mobileQueryListener: () => void;
  private mobileQuery: MediaQueryList;
  private isMobile = new BehaviorSubject<boolean>(false);

  constructor() {
    this.mobileQuery = window.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () =>
      this.isMobile.next(this.mobileQuery.matches);
    this.mobileQuery.addListener(this.mobileQueryListener);

    // Initial check
    this.isMobile.next(this.mobileQuery.matches);
  }

  get isMobile$(): Observable<boolean> {
    return this.isMobile.asObservable();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }
}
