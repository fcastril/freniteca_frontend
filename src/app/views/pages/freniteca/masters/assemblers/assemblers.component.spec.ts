import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblersComponent } from './assemblers.component';

describe('AssemblersComponent', () => {
  let component: AssemblersComponent;
  let fixture: ComponentFixture<AssemblersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssemblersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssemblersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
