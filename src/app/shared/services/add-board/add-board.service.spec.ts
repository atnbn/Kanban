import { TestBed } from '@angular/core/testing';

import { OpenPopUpService } from './add-board-up.service';

describe('OpenPopUpService', () => {
  let service: OpenPopUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenPopUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
