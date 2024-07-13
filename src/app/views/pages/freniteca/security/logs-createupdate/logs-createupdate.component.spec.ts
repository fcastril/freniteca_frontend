import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsCreateupdateComponent } from './logs-createupdate.component';

describe('LogsCreateupdateComponent', () => {
  let component: LogsCreateupdateComponent;
  let fixture: ComponentFixture<LogsCreateupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogsCreateupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogsCreateupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
