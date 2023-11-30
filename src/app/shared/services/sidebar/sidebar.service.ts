import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private sidebarStatus: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  sidebar$: Observable<boolean> = this.sidebarStatus.asObservable();
  constructor() {}

  toggleSidebar() {
    const currentMode = this.sidebarStatus.value;
    this.sidebarStatus.next(!currentMode);
  }
}
