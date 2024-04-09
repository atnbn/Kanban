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

  private editBoard = new BehaviorSubject<boolean>(false);
  editBoard$ = this.editBoard.asObservable();

  private detailTask = new BehaviorSubject<boolean>(false);
  detailTask$ = this.detailTask.asObservable();

  private addTask = new BehaviorSubject<boolean>(false);
  addTask$ = this.addTask.asObservable();

  private editTask = new BehaviorSubject<boolean>(false);
  editTask$ = this.editTask.asObservable();

  private deleteBoard = new BehaviorSubject<boolean>(false);
  deleteBoard$ = this.deleteBoard.asObservable();

  private deleteTask = new BehaviorSubject<boolean>(false);
  deleteTask$ = this.deleteTask.asObservable();

  private deleteUser = new BehaviorSubject<boolean>(false);
  deleteUser$ = this.deleteUser.asObservable();

  private changeLanguage = new BehaviorSubject<boolean>(false);
  changeLanguage$ = this.changeLanguage.asObservable();

  openAddBoard() {
    this.addBoard.next(true);
  }
  openEditBoard() {
    this.editBoard.next(true);
  }

  openAddTask() {
    this.addTask.next(true);
  }

  openEditTask() {
    this.editTask.next(true);
  }

  openDetailTask() {
    this.detailTask.next(true);
  }

  openDeleteBoard() {
    this.deleteBoard.next(true);
  }

  openDeleteTask() {
    this.deleteTask.next(true);
  }
  openDeleteUser() {
    this.deleteUser.next(true);
  }

  openChangeLanguage() {
    this.changeLanguage.next(true);
  }

  closeDetailTask() {
    this.detailTask.next(false);
  }

  closeDeleteUser() {
    this.deleteUser.next(false);
  }

  closeAddTask() {
    this.addTask.next(false);
  }

  closeAddBoard() {
    this.addBoard.next(false);
  }

  closeEditBoard() {
    this.editBoard.next(false);
  }

  closeEditTask() {
    this.editTask.next(false);
  }

  closeDeleteBoard() {
    this.deleteBoard.next(false);
  }
  closeDeleteTask() {
    this.deleteTask.next(false);
  }

  closeChangeLanguage() {
    this.changeLanguage.next(false);
  }
}
