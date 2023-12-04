import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailComponent } from './detail-task.component';

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskDetailComponent],
    });
    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
