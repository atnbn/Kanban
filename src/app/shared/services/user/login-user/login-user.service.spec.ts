import { TestBed } from '@angular/core/testing';

import { AuthUserService } from './login-user.service';

describe('LoginUserService', () => {
  let service: AuthUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
