import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonesCreateupdateComponent } from './zones-createupdate.component';

describe('ZonesCreateupdateComponent', () => {
  let component: ZonesCreateupdateComponent;
  let fixture: ComponentFixture<ZonesCreateupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZonesCreateupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZonesCreateupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
