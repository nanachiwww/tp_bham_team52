import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StressTrackerFormService } from './stress-tracker-form.service';
import { StressTrackerService } from '../service/stress-tracker.service';
import { IStressTracker } from '../stress-tracker.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { StressTrackerUpdateComponent } from './stress-tracker-update.component';

describe('StressTracker Management Update Component', () => {
  let comp: StressTrackerUpdateComponent;
  let fixture: ComponentFixture<StressTrackerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let stressTrackerFormService: StressTrackerFormService;
  let stressTrackerService: StressTrackerService;
  let userProfileService: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [StressTrackerUpdateComponent],
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
      .overrideTemplate(StressTrackerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StressTrackerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    stressTrackerFormService = TestBed.inject(StressTrackerFormService);
    stressTrackerService = TestBed.inject(StressTrackerService);
    userProfileService = TestBed.inject(UserProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserProfile query and add missing value', () => {
      const stressTracker: IStressTracker = { id: 456 };
      const userProfile: IUserProfile = { id: 5260 };
      stressTracker.userProfile = userProfile;

      const userProfileCollection: IUserProfile[] = [{ id: 5120 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [userProfile];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ stressTracker });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const stressTracker: IStressTracker = { id: 456 };
      const userProfile: IUserProfile = { id: 90393 };
      stressTracker.userProfile = userProfile;

      activatedRoute.data = of({ stressTracker });
      comp.ngOnInit();

      expect(comp.userProfilesSharedCollection).toContain(userProfile);
      expect(comp.stressTracker).toEqual(stressTracker);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStressTracker>>();
      const stressTracker = { id: 123 };
      jest.spyOn(stressTrackerFormService, 'getStressTracker').mockReturnValue(stressTracker);
      jest.spyOn(stressTrackerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stressTracker });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stressTracker }));
      saveSubject.complete();

      // THEN
      expect(stressTrackerFormService.getStressTracker).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(stressTrackerService.update).toHaveBeenCalledWith(expect.objectContaining(stressTracker));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStressTracker>>();
      const stressTracker = { id: 123 };
      jest.spyOn(stressTrackerFormService, 'getStressTracker').mockReturnValue({ id: null });
      jest.spyOn(stressTrackerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stressTracker: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stressTracker }));
      saveSubject.complete();

      // THEN
      expect(stressTrackerFormService.getStressTracker).toHaveBeenCalled();
      expect(stressTrackerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStressTracker>>();
      const stressTracker = { id: 123 };
      jest.spyOn(stressTrackerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stressTracker });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(stressTrackerService.update).toHaveBeenCalled();
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
