import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserProfileDetailComponent } from './user-profile-detail.component';

describe('UserProfile Management Detail Component', () => {
  let comp: UserProfileDetailComponent;
  let fixture: ComponentFixture<UserProfileDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserProfileDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userProfile: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserProfileDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserProfileDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userProfile on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userProfile).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
