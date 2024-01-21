import { TestBed } from '@angular/core/testing';

import { AddTaskApiService } from './add-task-api.service';

describe('AddTaskApiService', () => {
  let service: AddTaskApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddTaskApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
