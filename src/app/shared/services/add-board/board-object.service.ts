import { Injectable } from '@angular/core';
import { Board } from '../models/board-interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardObjectService {
  private boardObjectsSubject = new BehaviorSubject<any[]>([]);
  private sidebarDataSubject = new BehaviorSubject<any>({});

  sidebarData$ = this.sidebarDataSubject.asObservable();

  addBoardObject(obj: Board[]) {
    this.boardObjectsSubject.next(obj);
  }

  getBoardObjects() {
    return this.boardObjectsSubject.asObservable();
  }

  submitDataToBoard(data: any) {
    this.sidebarDataSubject.next(data);
  }
}
