import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerStartingComponent } from './server-starting.component';

describe('ServerStartingComponent', () => {
  let component: ServerStartingComponent;
  let fixture: ComponentFixture<ServerStartingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServerStartingComponent]
    });
    fixture = TestBed.createComponent(ServerStartingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
