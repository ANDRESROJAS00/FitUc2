import { TestBed } from '@angular/core/testing';

import { OpenfoodfactsService } from './openfoodfacts.service';

describe('OpenfoodfactsService', () => {
  let service: OpenfoodfactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenfoodfactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
