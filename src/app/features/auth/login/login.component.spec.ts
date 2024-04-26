import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthUserService } from 'src/app/shared/services/user/login-user/login-user.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

fdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginMockService;
  beforeEach(() => {
    loginMockService = jasmine.createSpyObj(['login']);
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [{ provide: AuthUserService, useValue: loginMockService }],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should login with correct form', () => {
  //   // console.log(component.formGroup.value);
  // });
});
