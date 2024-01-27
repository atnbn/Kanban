import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/shared/models/notification-interface';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        animate(
          '0.5s ease-out',
          keyframes([
            style({ transform: 'translateY(-100%)' }), // Start off-screen (top)
            style({ transform: 'translateY(0)' }), // Slide down to the view
            style({ transform: 'translateY(-10%)' }), // Settle back up a bit
          ])
        ),
      ]),
      transition(':leave', [
        animate('0.5s ease-in', style({ transform: 'translateY(-100%)' })),
      ]),
    ]),
  ],
})
export class NotificationComponent implements OnInit {
  messageType: string = '';
  darkMode: boolean = false;
  showMessage: boolean = false;
  @Input() messageObject: Message = {
    message: '',
    type: '',
  };

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((theme) => {
      this.darkMode = theme;
    });

    if (
      this.messageObject.message !== '' &&
      this.messageObject.type === 'success'
    ) {
      this.messageType = 'success';
      this.setTimer();
    }
    if (
      this.messageObject.message !== '' &&
      this.messageObject.type === 'error'
    ) {
      this.messageType = 'error';
      this.setTimer();
    }
  }
  setTimer() {
    this.showMessage = true;
    setTimeout(() => {
      this.showMessage = false;
    }, 3000);
  }
}
