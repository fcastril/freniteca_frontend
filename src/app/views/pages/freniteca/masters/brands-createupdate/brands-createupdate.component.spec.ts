import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsCreateupdateComponent } from './brands-createupdate.component';

describe('BrandsCreateupdateComponent', () => {
  let component: BrandsCreateupdateComponent;
  let fixture: ComponentFixture<BrandsCreateupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandsCreateupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandsCreateupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
