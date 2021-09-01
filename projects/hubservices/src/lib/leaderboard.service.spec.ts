import { TestBed } from '@angular/core/testing';

import { TeamLeaderboardService } from './leaderboard.service';

describe('TeamLeaderboardService', () => {
  let service: TeamLeaderboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamLeaderboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
