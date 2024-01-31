import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthUserService } from 'src/app/shared/services/user/login-user/login-user.service';
import { User } from 'src/app/shared/models/user-interface';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';
import { ReturnMessageService } from 'src/app/shared/services/return-message/return-message.service';
import { Message } from 'src/app/shared/models/notification-interface';
import { SHA256 } from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  darkmode: boolean = false;
  userForm!: FormGroup;

  localStorageData: boolean = false;
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

    if (localStorage.getItem('localstorage') === 'true') {
      this.localStorageData = true;
      this.userForm.patchValue({
        email: localStorage.getItem('email'),
        password: atob(localStorage.getItem('password') || ''),
      });
    }
    this.messageService.message$.subscribe((object: any) => {
      if (object.message !== '') {
        console.log(object);
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
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(7), Validators.required]],
    });
  }

  login(event: Event) {
    const value = this.userForm.value;
    if (this.userForm.invalid) {
      return;
    }
    const hashedPassword = SHA256(value.password).toString();
    value.password = hashedPassword;
    event.preventDefault();
    this.authUserService.login(value.email, value.password).subscribe({
      next: (response) => {
        this.localStorage();
        this.messageService.setMessage({
          message: response.message,
          type: 'success',
        });
        this.router.navigate(['/home']); // Navigate on successful login
      },
      error: (error) => {
        console.log(error);
        this.messageService.setMessage({
          message: error.error.message,
          type: 'success',
        });
      },
    });
  }

  checkValidator(formControlName: string, errorType: string) {
    const control = this.userForm.get(formControlName);
    return control?.hasError(errorType) && control.touched;
  }

  localStorage() {
    const hashedPassword = btoa(this.userForm.value.password);
    if (this.localStorageData) {
      localStorage.setItem('localstorage', 'true');
      localStorage.setItem('email', this.userForm.value.email);
      localStorage.setItem('password', hashedPassword);
    } else {
      localStorage.removeItem('localstorage');
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }
  }
}
