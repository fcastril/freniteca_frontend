import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeproductsCreateupdateComponent } from './typeproducts-createupdate.component';

describe('TypeproductsCreateupdateComponent', () => {
  let component: TypeproductsCreateupdateComponent;
  let fixture: ComponentFixture<TypeproductsCreateupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeproductsCreateupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeproductsCreateupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
