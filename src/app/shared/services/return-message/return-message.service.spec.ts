import { TestBed } from '@angular/core/testing';

import { ReturnMessageService } from './return-message.service';

describe('ReturnMessageService', () => {
  let service: ReturnMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturnMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
