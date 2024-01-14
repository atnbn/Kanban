import { TestBed } from '@angular/core/testing';

import { SaveBoardService } from './save-board.service';

describe('SaveBoardService', () => {
  let service: SaveBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
