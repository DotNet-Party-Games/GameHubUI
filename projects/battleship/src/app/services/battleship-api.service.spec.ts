import { TestBed } from '@angular/core/testing';

import { BattleshipAPIService } from './battleship-api.service';

describe('BattleshipAPIService', () => {
  let service: BattleshipAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BattleshipAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
