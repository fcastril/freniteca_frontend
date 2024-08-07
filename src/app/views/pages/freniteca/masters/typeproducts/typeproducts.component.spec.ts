import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeproductsComponent } from './typeproducts.component';

describe('TypeproductsComponent', () => {
  let component: TypeproductsComponent;
  let fixture: ComponentFixture<TypeproductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeproductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
