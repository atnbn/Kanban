import { HostListener, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Message } from 'src/app/shared/models/notification-interface';
import { OpenPopUpService } from 'src/app/shared/services/add-board/add-board-up.service';
import { ReturnMessageService } from 'src/app/shared/services/return-message/return-message.service';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';
import { AuthUserService } from 'src/app/shared/services/user/login-user/login-user.service';

@Injectable({
  providedIn: 'root', //
})
export class BaseWrapper implements OnInit {
  isLoading: boolean = false;
  language: boolean = false;
  darkmode: boolean = false;
  formGroup!: FormGroup;
  message: string = '';
  showMessage: boolean = false;
  messageObject: Message = {} as Message;

  constructor(
    protected themeService: ThemeService,
    protected fb: FormBuilder,
    protected router: Router,
    protected translate: TranslateService,
    protected popUpService: OpenPopUpService,
    protected messageService: ReturnMessageService
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((theme: boolean) => {
      this.darkmode = theme;
    });
    this.messageService.message$.subscribe((object: any) => {
      if (object.message !== '') {
        this.messageObject = object;
        this.showMessage = true;
        this.setTimer();
      }
    });
  }

  initializeForm(config: any) {
    this.formGroup = this.fb.group(config);
  }

  setTimer() {
    setTimeout(() => {
      this.showMessage = false;
      this.messageObject = {
        message: '',
        type: '',
      };
    }, 3500);
  }
}
