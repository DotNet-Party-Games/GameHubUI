import { TestBed } from '@angular/core/testing';

import { PartygameService } from './partygame.service';

describe('PartygameService', () => {
  let service: PartygameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PartygameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
