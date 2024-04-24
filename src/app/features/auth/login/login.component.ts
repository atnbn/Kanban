import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthUserService } from 'src/app/shared/services/user/login-user/login-user.service';
import { User } from 'src/app/shared/models/user-interface';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';
import { ReturnMessageService } from 'src/app/shared/services/return-message/return-message.service';
import { Message } from 'src/app/shared/models/notification-interface';
import { BaseWrapper } from 'src/app/core/components/base-wrapper';
import { OpenPopUpService } from 'src/app/shared/services/add-board/add-board-up.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseWrapper {
  localStorageData: boolean = false;
  error: boolean = false;

  constructor(
    themeService: ThemeService,
    fb: FormBuilder,
    router: Router,
    translate: TranslateService,
    popUpService: OpenPopUpService,
    messageService: ReturnMessageService,
    private authUserService: AuthUserService
  ) {
    super(themeService, fb, router, translate, popUpService, messageService);
    this.initializeForm({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(7), Validators.required]],
    });
    if (localStorage.getItem('localstorage') === 'true') {
      this.localStorageData = true;
      this.formGroup.patchValue({
        email: localStorage.getItem('email'),
        password: atob(localStorage.getItem('password') || ''),
      });
    }
  }

  login(event: Event) {
    const value = this.formGroup.value;
    this.isLoading = true;
    if (this.formGroup.invalid) {
      return;
    }
    event.preventDefault();
    this.authUserService.login(value.email, value.password).subscribe({
      next: (response) => {
        this.localStorage();
        this.isLoading = false;

        this.messageService.setMessage({
          message: response.message,
          type: 'success',
        });
        this.router.navigate(['/home']); // Navigate on successful login
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.setMessage({
          message: error.error.message,
          type: 'error',
        });
      },
    });
  }

  checkValidator(formControlName: string, errorType: string) {
    const control = this.formGroup.get(formControlName);
    return control?.hasError(errorType) && control.touched;
  }

  localStorage() {
    const hashedPassword = btoa(this.formGroup.value.password);
    if (this.localStorageData) {
      localStorage.setItem('localstorage', 'true');
      localStorage.setItem('email', this.formGroup.value.email);
      localStorage.setItem('password', hashedPassword);
    } else {
      localStorage.removeItem('localstorage');
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }
  }
}
