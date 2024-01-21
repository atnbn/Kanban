import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CreateUserService } from 'src/app/shared/services/user/create-user/create-user.service';
import { User } from 'src/app/shared/models/user-interface';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';
import { ReturnMessageService } from 'src/app/shared/services/return-message/return-message.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  darkmode: boolean = false;
  userForm!: FormGroup;
  errorMessage: string = '';
  allUserEmails: User[] = [];
  constructor(
    private themeService: ThemeService,
    private fb: FormBuilder,
    private createUserService: CreateUserService,
    private router: Router,
    private messageService: ReturnMessageService
  ) {}
  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((theme) => {
      this.darkmode = theme;
    });

    this.initializeForm();
    // this.getData();
  }

  initializeForm() {
    this.userForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      username: ['', [Validators.minLength(3), Validators.required]],
      password: ['', [Validators.minLength(7), Validators.required]],
      confirmedPassword: ['', [Validators.minLength(7), Validators.required]],
    });
  }

  createUser() {
    this.checkSamePassword();
    if (this.userForm.invalid) {
      return;
    }

    const user = this.userForm.value;

    const newUser = {
      username: user.username,
      password: user.password,
      confirmedPassword: user.confirmedPassword,
      email: user.email,
    };
    this.createUserService.signUser(newUser).subscribe({
      next: (response) => {
        this.messageService.setMessage({
          message: response.message,
          type: 'success',
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.messageService.setMessage({
          message: error.error,
          type: 'error',
        });
      },
    });
  }

  checkValidator(formControlName: string, errorType: string) {
    const control = this.userForm.get(formControlName);
    return control?.hasError(errorType) && control.touched;
  }

  checkSamePassword() {
    const password = this.userForm.get('password')?.value;
    const confirmedPassword = this.userForm.get('confirmedPassword')?.value;
    if (this.passwordNotMatch(password, confirmedPassword)) {
      this.userForm.get('confirmedPassword')?.setErrors({
        notSame: true,
      });
      console.log(this.userForm.get('confirmedPassword'));
    }
  }

  passwordNotMatch(password: string, confirmedPassword: string) {
    return password !== confirmedPassword;
  }
}
