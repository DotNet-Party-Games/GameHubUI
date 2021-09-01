import { TestBed } from '@angular/core/testing';

import { HubLeaderboardService } from './hub-leaderboard.service';

describe('HubLeaderboardService', () => {
  let service: HubLeaderboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HubLeaderboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
