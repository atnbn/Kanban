import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginUserService } from 'src/app/shared/services/login-user/login-user.service';
import { User } from 'src/app/shared/services/models/user-interface';
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
    private loginUserService: LoginUserService
  ) {}
  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((theme) => {
      this.darkmode = theme;
    });
    this.initliazeForm();
  }

  initliazeForm() {
    this.userForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(7), Validators.required]],
    });
  }
  // checkLoginData() {
  //   return this.users.find(
  //     (user) =>
  //       user.email === this.userForm.value.email &&
  //       user.password === this.userForm.value.password
  //   );
  // }
  login() {
    const value = this.userForm.value;
    console.log(value);
    if (this.userForm.invalid) return;
    this.loginUserService.login(value.email, value.password).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => console.log(error)
    );
    console.log('works');
  }
}
