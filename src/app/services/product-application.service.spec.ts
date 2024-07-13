import { TestBed } from '@angular/core/testing';

import { ProductApplicationService } from './product-application.service';

describe('ProductApplicationService', () => {
  let service: ProductApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
