import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCategorylistComponent } from './profile-categorylist.component';

describe('ProfileCategorylistComponent', () => {
  let component: ProfileCategorylistComponent;
  let fixture: ComponentFixture<ProfileCategorylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileCategorylistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCategorylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
