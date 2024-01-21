import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../../models/notification-interface';

@Injectable({
  providedIn: 'root',
})
export class ReturnMessageService {
  private message: BehaviorSubject<Message> = new BehaviorSubject<Message>({
    message: '',
    type: '',
  });
  message$: Observable<Message> = this.message.asObservable();

  constructor() {}

  setMessage(object: Message) {
    this.message.next(object);
  }
}
