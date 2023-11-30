import { Injectable } from '@angular/core';
import { Board } from '../../models/board-interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardObjectService {
  private boardObjectsSubject = new BehaviorSubject<any>({});

  addBoardObject(obj: any) {
    this.boardObjectsSubject.next(obj);
  }

  getBoardObjects() {
    return this.boardObjectsSubject.asObservable();
  }
}
