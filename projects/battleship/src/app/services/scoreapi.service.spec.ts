import { TestBed } from '@angular/core/testing';

import { ScoreapiService } from './scoreapi.service';

describe('ScoreapiService', () => {
  let service: ScoreapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoreapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
