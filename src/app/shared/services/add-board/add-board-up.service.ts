import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpenPopUpService {
  private modalState = new BehaviorSubject<boolean>(false);
  modalState$ = this.modalState.asObservable();

  constructor() {}

  openModal() {
    this.modalState.next(true);
    console.log('true');
  }

  closeModal() {
    this.modalState.next(false);
    console.log('false');
  }
}
