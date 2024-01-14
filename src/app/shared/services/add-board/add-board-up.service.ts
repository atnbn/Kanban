import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Board } from '../../models/board-interface';

@Injectable({
  providedIn: 'root',
})
export class OpenPopUpService {
  private addBoard = new BehaviorSubject<boolean>(false);
  addBoard$ = this.addBoard.asObservable();
  private addTask = new BehaviorSubject<boolean>(false);
  addTask$ = this.addTask.asObservable();

  openAddBoard() {
    this.addBoard.next(true);
  }

  closeAddBoard() {
    this.addBoard.next(false);
  }

  openAddTask() {
    this.addTask.next(true);
  }

  closeAddTask() {
    this.addTask.next(false);
  }
}
