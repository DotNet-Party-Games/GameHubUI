import { TestBed } from '@angular/core/testing';

import { StatisticapiService } from './statisticapi.service';

describe('StatisticapiService', () => {
  let service: StatisticapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatisticapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
