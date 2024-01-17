import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblersCreateupdateComponent } from './assemblers-createupdate.component';

describe('AssemblersCreateupdateComponent', () => {
  let component: AssemblersCreateupdateComponent;
  let fixture: ComponentFixture<AssemblersCreateupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssemblersCreateupdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssemblersCreateupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
