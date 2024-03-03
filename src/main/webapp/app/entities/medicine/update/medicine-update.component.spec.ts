import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MedicineFormService } from './medicine-form.service';
import { MedicineService } from '../service/medicine.service';
import { IMedicine } from '../medicine.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { MedicineUpdateComponent } from './medicine-update.component';

describe('Medicine Management Update Component', () => {
  let comp: MedicineUpdateComponent;
  let fixture: ComponentFixture<MedicineUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let medicineFormService: MedicineFormService;
  let medicineService: MedicineService;
  let userProfileService: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MedicineUpdateComponent],
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
      .overrideTemplate(MedicineUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MedicineUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    medicineFormService = TestBed.inject(MedicineFormService);
    medicineService = TestBed.inject(MedicineService);
    userProfileService = TestBed.inject(UserProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserProfile query and add missing value', () => {
      const medicine: IMedicine = { id: 456 };
      const userProfile: IUserProfile = { id: 45972 };
      medicine.userProfile = userProfile;

      const userProfileCollection: IUserProfile[] = [{ id: 59504 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [userProfile];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ medicine });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const medicine: IMedicine = { id: 456 };
      const userProfile: IUserProfile = { id: 99432 };
      medicine.userProfile = userProfile;

      activatedRoute.data = of({ medicine });
      comp.ngOnInit();

      expect(comp.userProfilesSharedCollection).toContain(userProfile);
      expect(comp.medicine).toEqual(medicine);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedicine>>();
      const medicine = { id: 123 };
      jest.spyOn(medicineFormService, 'getMedicine').mockReturnValue(medicine);
      jest.spyOn(medicineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medicine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: medicine }));
      saveSubject.complete();

      // THEN
      expect(medicineFormService.getMedicine).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(medicineService.update).toHaveBeenCalledWith(expect.objectContaining(medicine));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedicine>>();
      const medicine = { id: 123 };
      jest.spyOn(medicineFormService, 'getMedicine').mockReturnValue({ id: null });
      jest.spyOn(medicineService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medicine: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: medicine }));
      saveSubject.complete();

      // THEN
      expect(medicineFormService.getMedicine).toHaveBeenCalled();
      expect(medicineService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedicine>>();
      const medicine = { id: 123 };
      jest.spyOn(medicineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medicine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(medicineService.update).toHaveBeenCalled();
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
