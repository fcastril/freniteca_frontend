import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellersCreateupdateComponent } from './sellers-createupdate.component';

describe('SellersCreateupdateComponent', () => {
  let component: SellersCreateupdateComponent;
  let fixture: ComponentFixture<SellersCreateupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellersCreateupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellersCreateupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
