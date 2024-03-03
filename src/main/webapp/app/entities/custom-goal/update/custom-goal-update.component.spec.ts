import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CustomGoalFormService } from './custom-goal-form.service';
import { CustomGoalService } from '../service/custom-goal.service';
import { ICustomGoal } from '../custom-goal.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { CustomGoalUpdateComponent } from './custom-goal-update.component';

describe('CustomGoal Management Update Component', () => {
  let comp: CustomGoalUpdateComponent;
  let fixture: ComponentFixture<CustomGoalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let customGoalFormService: CustomGoalFormService;
  let customGoalService: CustomGoalService;
  let userProfileService: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CustomGoalUpdateComponent],
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
      .overrideTemplate(CustomGoalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CustomGoalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    customGoalFormService = TestBed.inject(CustomGoalFormService);
    customGoalService = TestBed.inject(CustomGoalService);
    userProfileService = TestBed.inject(UserProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserProfile query and add missing value', () => {
      const customGoal: ICustomGoal = { id: 456 };
      const userProfile: IUserProfile = { id: 35280 };
      customGoal.userProfile = userProfile;

      const userProfileCollection: IUserProfile[] = [{ id: 36717 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [userProfile];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ customGoal });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const customGoal: ICustomGoal = { id: 456 };
      const userProfile: IUserProfile = { id: 48769 };
      customGoal.userProfile = userProfile;

      activatedRoute.data = of({ customGoal });
      comp.ngOnInit();

      expect(comp.userProfilesSharedCollection).toContain(userProfile);
      expect(comp.customGoal).toEqual(customGoal);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICustomGoal>>();
      const customGoal = { id: 123 };
      jest.spyOn(customGoalFormService, 'getCustomGoal').mockReturnValue(customGoal);
      jest.spyOn(customGoalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customGoal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: customGoal }));
      saveSubject.complete();

      // THEN
      expect(customGoalFormService.getCustomGoal).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(customGoalService.update).toHaveBeenCalledWith(expect.objectContaining(customGoal));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICustomGoal>>();
      const customGoal = { id: 123 };
      jest.spyOn(customGoalFormService, 'getCustomGoal').mockReturnValue({ id: null });
      jest.spyOn(customGoalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customGoal: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: customGoal }));
      saveSubject.complete();

      // THEN
      expect(customGoalFormService.getCustomGoal).toHaveBeenCalled();
      expect(customGoalService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICustomGoal>>();
      const customGoal = { id: 123 };
      jest.spyOn(customGoalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customGoal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(customGoalService.update).toHaveBeenCalled();
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
