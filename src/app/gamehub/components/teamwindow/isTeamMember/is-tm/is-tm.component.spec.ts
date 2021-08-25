import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsTMComponent } from './is-tm.component';

describe('IsTMComponent', () => {
  let component: IsTMComponent;
  let fixture: ComponentFixture<IsTMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsTMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsTMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
