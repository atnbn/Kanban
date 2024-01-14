import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Board } from '../../models/board-interface';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private sidebarStatus: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  sidebar$: Observable<boolean> = this.sidebarStatus.asObservable();

  private storage: BehaviorSubject<[]> = new BehaviorSubject<[]>([]);
  storage$: Observable<[]> = this.storage.asObservable();
  constructor() {}

  toggleSidebar() {
    const currentMode = this.sidebarStatus.value;
    this.sidebarStatus.next(!currentMode);
  }

  fillStorage(boards: []) {
    this.storage.next(boards);
  }
}
