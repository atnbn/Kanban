import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { CreateUserService } from 'src/app/shared/services/user/create-user/create-user.service';
import { LoginUserService } from 'src/app/shared/services/user/login-user/login-user.service';
import { User } from 'src/app/shared/models/user-interface';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';

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
    private loginService: LoginUserService,
    private sidebarService: SidebarService,
    private router: Router
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
    });
  }

  createUser() {
    if (this.userForm.invalid) {
      return;
    }

    const user = this.userForm.value;

    const newUser = {
      username: user.username,
      password: user.password,
      email: user.email,
    };
    this.createUserService.signUser(newUser).subscribe({
      next: (response) => {
        this.router.navigate(['/login']);
        console.log(response);
      },
      error: (error) => {
        console.log(error);
        this.errorMessage = error.error;
      },
    });
  }

  checkValidator(formControlName: string, errorType: string) {
    const control = this.userForm.get(formControlName);
    return control?.hasError(errorType) && control.touched;
  }
}
