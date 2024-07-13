import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsCreateupdateComponent } from './applications-createupdate.component';

describe('ApplicationsCreateupdateComponent', () => {
  let component: ApplicationsCreateupdateComponent;
  let fixture: ComponentFixture<ApplicationsCreateupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationsCreateupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationsCreateupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
