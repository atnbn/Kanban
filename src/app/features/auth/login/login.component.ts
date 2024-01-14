import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginUserService } from 'src/app/shared/services/user/login-user/login-user.service';
import { User } from 'src/app/shared/models/user-interface';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';

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
  constructor(
    private themeService: ThemeService,
    private fb: FormBuilder,
    private loginUserService: LoginUserService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((theme) => {
      this.darkmode = theme;
    });
    this.initliazeForm();
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
    this.loginUserService.login(value.email, value.password).subscribe({
      next: (response) => {
        console.log(response.email);

        this.router.navigate(['/home']); // Navigate on successful login
      },
      error: (error) => {
        console.log(error);
        // Handle login error (e.g., show an error message)
      },
    });
  }
}
