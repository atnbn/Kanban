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
import { BaseWrapper } from 'src/app/core/components/base-wrapper';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent extends BaseWrapper {
  errorMessage: string = '';
  show: boolean = false;
  lang: string = '';
  constructor(
    private validatorService: ValidatorService,
    private createUserService: CreateUserService,
    themeService: ThemeService,
    fb: FormBuilder,
    router: Router,
    translate: TranslateService,
    messageService: ReturnMessageService,
    popUpService: OpenPopUpService
  ) {
    super(themeService, fb, router, translate, popUpService, messageService);
    this.initializeForm({
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
    if (this.formGroup.invalid) {
      return;
    }

    const user = this.formGroup.value;
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
    const control = this.formGroup.get(formControlName);
    return control?.hasError(errorType) && control.touched;
  }

  checkCustomValidator(formControlName: string, errorType: string): boolean {
    const control = this.formGroup.get(formControlName);
    // Check if control exists and is touched
    if (control && control.touched) {
      // Check for the specific error
      const errors = control.errors;
      return errors?.[errorType] === true;
    }
    return false;
  }

  checkSamePassword() {
    const password = this.formGroup.get('password')?.value;
    const confirmedPassword = this.formGroup.get('confirmedPassword')?.value;
    if (this.passwordNotMatch(password, confirmedPassword)) {
      this.formGroup.get('confirmedPassword')?.setErrors({
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
