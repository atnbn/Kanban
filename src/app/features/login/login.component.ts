import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  darkmode: boolean = false;
  userForm!: FormGroup;
  constructor(private themeService: ThemeService, private fb: FormBuilder) {}
  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((theme) => {
      this.darkmode = theme;
    });
    this.initliazeForm();
  }

  initliazeForm() {
    this.userForm = this.fb.group({
      email: ['', [Validators.email]],
      password: ['', Validators.minLength(7)],
    });
  }

  login() {
    console.log(this.userForm.value);
  }
}
