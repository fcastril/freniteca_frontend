import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsCreateupdateComponent } from './products-createupdate.component';

describe('ProductsCreateupdateComponent', () => {
  let component: ProductsCreateupdateComponent;
  let fixture: ComponentFixture<ProductsCreateupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsCreateupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsCreateupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
