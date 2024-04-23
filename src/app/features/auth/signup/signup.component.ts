import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CreateUserService } from 'src/app/shared/services/user/create-user/create-user.service';
import { User } from 'src/app/shared/models/user-interface';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';
import { ReturnMessageService } from 'src/app/shared/services/return-message/return-message.service';
import { ValidatorService } from 'src/app/shared/services/validator/validator.service';
import { LanguageService } from 'src/app/shared/services/language/language.service';
import { LanguageComponent } from 'src/app/shared/components/language/language/language.component';
import { OpenPopUpService } from 'src/app/shared/services/add-board/add-board-up.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  currentLanguage: string = 'en';
  darkmode: boolean = false;
  userForm!: FormGroup;
  language: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;
  allUserEmails: User[] = [];
  show: boolean = false;
  lang: string = '';
  constructor(
    private themeService: ThemeService,
    private fb: FormBuilder,
    private createUserService: CreateUserService,
    private router: Router,
    private messageService: ReturnMessageService,
    private validatorService: ValidatorService,
    private popUpService: OpenPopUpService
  ) {}
  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe((theme) => {
      this.darkmode = theme;
    });

    this.initializeForm();
  }

  initializeForm() {
    this.userForm = this.fb.group({
      email: [
        '',
        [
          Validators.email,
          Validators.required,
          this.validatorService.isValidEmail.bind(this.validatorService),
        ],
      ],
      username: [
        '',
        [
          Validators.required,
          this.validatorService.isValidUsername.bind(this.validatorService),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          this.validatorService.isValidPassword.bind(this.validatorService),
        ],
      ],
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
        this.isLoading = true;
        this.messageService.setMessage({
          message: response,
          type: 'success',
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading = true;
        this.errorMessage = error.error;
        this.show = true;
        this.messageService.setMessage({
          message: error,
          type: 'error',
        });
      },
    });
  }

  checkValidator(formControlName: string, errorType: string) {
    const control = this.userForm.get(formControlName);
    return control?.hasError(errorType) && control.touched;
  }

  checkCustomValidator(formControlName: string, errorType: string): boolean {
    const control = this.userForm.get(formControlName);
    // Check if control exists and is touched
    if (control && control.touched) {
      // Check for the specific error
      const errors = control.errors;
      return errors?.[errorType] === true;
    }
    return false;
  }

  checkSamePassword() {
    const password = this.userForm.get('password')?.value;
    const confirmedPassword = this.userForm.get('confirmedPassword')?.value;
    if (this.passwordNotMatch(password, confirmedPassword)) {
      this.userForm.get('confirmedPassword')?.setErrors({
        notSame: true,
      });
    }
  }
  triggerLanguage() {
    this.popUpService.openChangeLanguage();
    this.language = !this.language;
  }
  passwordNotMatch(password: string, confirmedPassword: string) {
    return password !== confirmedPassword;
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const element = clickedElement.className;
    if (element === 'setting-img' || element === 'con dark-mode') {
      this.language = true;
    } else {
      this.language = false;
    }
  }
}
