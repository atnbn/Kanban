import { TestBed } from '@angular/core/testing';

import { BoardObjectService } from './board-object.service';

describe('BoardObjectService', () => {
  let service: BoardObjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardObjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
