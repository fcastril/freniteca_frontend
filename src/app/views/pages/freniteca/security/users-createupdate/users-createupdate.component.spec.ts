import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCreateupdateComponent } from './users-createupdate.component';

describe('UsersCreateupdateComponent', () => {
  let component: UsersCreateupdateComponent;
  let fixture: ComponentFixture<UsersCreateupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersCreateupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersCreateupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
