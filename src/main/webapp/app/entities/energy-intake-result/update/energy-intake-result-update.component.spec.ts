import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EnergyIntakeResultFormService } from './energy-intake-result-form.service';
import { EnergyIntakeResultService } from '../service/energy-intake-result.service';
import { IEnergyIntakeResult } from '../energy-intake-result.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { EnergyIntakeResultUpdateComponent } from './energy-intake-result-update.component';

describe('EnergyIntakeResult Management Update Component', () => {
  let comp: EnergyIntakeResultUpdateComponent;
  let fixture: ComponentFixture<EnergyIntakeResultUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let energyIntakeResultFormService: EnergyIntakeResultFormService;
  let energyIntakeResultService: EnergyIntakeResultService;
  let userProfileService: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EnergyIntakeResultUpdateComponent],
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
      .overrideTemplate(EnergyIntakeResultUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EnergyIntakeResultUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    energyIntakeResultFormService = TestBed.inject(EnergyIntakeResultFormService);
    energyIntakeResultService = TestBed.inject(EnergyIntakeResultService);
    userProfileService = TestBed.inject(UserProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserProfile query and add missing value', () => {
      const energyIntakeResult: IEnergyIntakeResult = { id: 456 };
      const userProfile: IUserProfile = { id: 51129 };
      energyIntakeResult.userProfile = userProfile;

      const userProfileCollection: IUserProfile[] = [{ id: 30746 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [userProfile];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ energyIntakeResult });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const energyIntakeResult: IEnergyIntakeResult = { id: 456 };
      const userProfile: IUserProfile = { id: 79910 };
      energyIntakeResult.userProfile = userProfile;

      activatedRoute.data = of({ energyIntakeResult });
      comp.ngOnInit();

      expect(comp.userProfilesSharedCollection).toContain(userProfile);
      expect(comp.energyIntakeResult).toEqual(energyIntakeResult);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEnergyIntakeResult>>();
      const energyIntakeResult = { id: 123 };
      jest.spyOn(energyIntakeResultFormService, 'getEnergyIntakeResult').mockReturnValue(energyIntakeResult);
      jest.spyOn(energyIntakeResultService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ energyIntakeResult });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: energyIntakeResult }));
      saveSubject.complete();

      // THEN
      expect(energyIntakeResultFormService.getEnergyIntakeResult).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(energyIntakeResultService.update).toHaveBeenCalledWith(expect.objectContaining(energyIntakeResult));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEnergyIntakeResult>>();
      const energyIntakeResult = { id: 123 };
      jest.spyOn(energyIntakeResultFormService, 'getEnergyIntakeResult').mockReturnValue({ id: null });
      jest.spyOn(energyIntakeResultService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ energyIntakeResult: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: energyIntakeResult }));
      saveSubject.complete();

      // THEN
      expect(energyIntakeResultFormService.getEnergyIntakeResult).toHaveBeenCalled();
      expect(energyIntakeResultService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEnergyIntakeResult>>();
      const energyIntakeResult = { id: 123 };
      jest.spyOn(energyIntakeResultService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ energyIntakeResult });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(energyIntakeResultService.update).toHaveBeenCalled();
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
