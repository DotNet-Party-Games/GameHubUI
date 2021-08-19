import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamwindowComponent } from './teamwindow.component';

describe('TeamwindowComponent', () => {
  let component: TeamwindowComponent;
  let fixture: ComponentFixture<TeamwindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamwindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamwindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
