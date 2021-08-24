import { TestBed } from '@angular/core/testing';
import { GameChatService } from './gamechat.service';

describe('GameChatService', () => {
  let service: GameChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});