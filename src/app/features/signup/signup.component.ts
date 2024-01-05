import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateUserService } from 'src/app/shared/services/create-user/create-user.service';
import { User } from 'src/app/shared/services/models/user-interface';
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
    private createUserService: CreateUserService
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
      console.log('error');
    }

    const user = this.userForm.value;

    const newUser = {
      username: user.username,
      password: user.password,
      email: user.email,
    };
    this.createUserService.signUser(newUser).subscribe(
      (response) => {
        // console.log('item was succesfully added', response);
      },
      (error) => (this.errorMessage = error.error)
    );
  }
}
