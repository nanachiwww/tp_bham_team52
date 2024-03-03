import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MoodTrackerFormService } from './mood-tracker-form.service';
import { MoodTrackerService } from '../service/mood-tracker.service';
import { IMoodTracker } from '../mood-tracker.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { MoodTrackerUpdateComponent } from './mood-tracker-update.component';

describe('MoodTracker Management Update Component', () => {
  let comp: MoodTrackerUpdateComponent;
  let fixture: ComponentFixture<MoodTrackerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let moodTrackerFormService: MoodTrackerFormService;
  let moodTrackerService: MoodTrackerService;
  let userProfileService: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MoodTrackerUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(MoodTrackerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MoodTrackerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    moodTrackerFormService = TestBed.inject(MoodTrackerFormService);
    moodTrackerService = TestBed.inject(MoodTrackerService);
    userProfileService = TestBed.inject(UserProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserProfile query and add missing value', () => {
      const moodTracker: IMoodTracker = { id: 456 };
      const userProfile: IUserProfile = { id: 19272 };
      moodTracker.userProfile = userProfile;

      const userProfileCollection: IUserProfile[] = [{ id: 81278 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [userProfile];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ moodTracker });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const moodTracker: IMoodTracker = { id: 456 };
      const userProfile: IUserProfile = { id: 54092 };
      moodTracker.userProfile = userProfile;

      activatedRoute.data = of({ moodTracker });
      comp.ngOnInit();

      expect(comp.userProfilesSharedCollection).toContain(userProfile);
      expect(comp.moodTracker).toEqual(moodTracker);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMoodTracker>>();
      const moodTracker = { id: 123 };
      jest.spyOn(moodTrackerFormService, 'getMoodTracker').mockReturnValue(moodTracker);
      jest.spyOn(moodTrackerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ moodTracker });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: moodTracker }));
      saveSubject.complete();

      // THEN
      expect(moodTrackerFormService.getMoodTracker).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(moodTrackerService.update).toHaveBeenCalledWith(expect.objectContaining(moodTracker));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMoodTracker>>();
      const moodTracker = { id: 123 };
      jest.spyOn(moodTrackerFormService, 'getMoodTracker').mockReturnValue({ id: null });
      jest.spyOn(moodTrackerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ moodTracker: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: moodTracker }));
      saveSubject.complete();

      // THEN
      expect(moodTrackerFormService.getMoodTracker).toHaveBeenCalled();
      expect(moodTrackerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMoodTracker>>();
      const moodTracker = { id: 123 };
      jest.spyOn(moodTrackerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ moodTracker });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(moodTrackerService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUserProfile', () => {
      it('Should forward to userProfileService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userProfileService, 'compareUserProfile');
        comp.compareUserProfile(entity, entity2);
        expect(userProfileService.compareUserProfile).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
