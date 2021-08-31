import { TestBed } from '@angular/core/testing';

import { BattleshipDeployService } from './battleship-deploy.service';

describe('BattleshipDeployService', () => {
  let service: BattleshipDeployService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BattleshipDeployService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
