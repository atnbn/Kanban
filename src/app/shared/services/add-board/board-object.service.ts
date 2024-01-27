import { Injectable } from '@angular/core';
import { Board, Task } from '../../models/board-interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardObjectService {
  private boardObjectsSubject = new BehaviorSubject<any>({});
  private sidebarDataSubject = new BehaviorSubject<any>({});
  sidebarData$ = this.sidebarDataSubject.asObservable();
  private task = new BehaviorSubject<any>({});
  task$ = this.task.asObservable();
  private board = new BehaviorSubject<any>({});
  board$ = this.task.asObservable();
  private storage = new BehaviorSubject<any>([]);
  storage$ = this.storage.asObservable();

  // addBoardObject(obj: Board) {
  //   this.boardObjectsSubject.next(obj);
  // }

  // getBoardObjects() {
  //   return this.boardObjectsSubject.asObservable();
  // }

  // submitDataToBoard(data: any) {
  //   this.sidebarDataSubject.next(data);
  // }
  submitStorage(data: any) {
    this.storage.next(data);
  }

  submitTask(data: Task) {
    this.task.next(data);
  }

  submitBoard(data: Board) {
    this.board.next(data);
  }

  getBoard() {
    return this.board.asObservable();
  }

  getTask() {
    return this.task.asObservable();
  }

  getStorage() {
    return this.storage.asObservable();
  }
}
