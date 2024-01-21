import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthUserService } from 'src/app/shared/services/user/login-user/login-user.service';
import { User } from 'src/app/shared/models/user-interface';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';
import { ReturnMessageService } from 'src/app/shared/services/return-message/return-message.service';
import { Message } from 'src/app/shared/models/notification-interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  darkmode: boolean = false;
  userForm!: FormGroup;
  users: User[] = [];
  error: boolean = false;
  messageObject: Message = {} as Message;
  message: string = '';
  showMessage: boolean = false;
  constructor(
    private themeService: ThemeService,
    private fb: FormBuilder,
    private authUserService: AuthUserService,
    private router: Router,
    private messageService: ReturnMessageService
  ) {}
  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((theme) => {
      this.darkmode = theme;
    });
    this.initliazeForm();
    this.messageService.message$.subscribe((object: any) => {
      console.log(object);
      if (object.message !== '') {
        this.messageObject = object;
        this.showMessage = true;
        this.setTimer();
      }
    });
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

  initliazeForm() {
    this.userForm = this.fb.group({
      email: ['guest@gmail.com', [Validators.email, Validators.required]],
      password: ['vegeta54', [Validators.minLength(7), Validators.required]],
    });
  }

  login() {
    const value = this.userForm.value;

    if (this.userForm.invalid) {
      return;
    }
    
    this.authUserService.login(value.email, value.password).subscribe({
      next: (response) => {
        this.router.navigate(['/home']); // Navigate on successful login
        this.messageService.setMessage({
          message: response.message,
          type: 'success',
        });
      },
      error: (error) => {
        this.messageService.setMessage({
          message: error.error,
          type: 'success',
        });
      },
    });
  }

  checkValidator(formControlName: string, errorType: string) {
    const control = this.userForm.get(formControlName);
    return control?.hasError(errorType) && control.touched;
  }
}
