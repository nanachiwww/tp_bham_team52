import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SleepRecordFormService } from './sleep-record-form.service';
import { SleepRecordService } from '../service/sleep-record.service';
import { ISleepRecord } from '../sleep-record.model';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { SleepRecordUpdateComponent } from './sleep-record-update.component';

describe('SleepRecord Management Update Component', () => {
  let comp: SleepRecordUpdateComponent;
  let fixture: ComponentFixture<SleepRecordUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sleepRecordFormService: SleepRecordFormService;
  let sleepRecordService: SleepRecordService;
  let userProfileService: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SleepRecordUpdateComponent],
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
      .overrideTemplate(SleepRecordUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SleepRecordUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sleepRecordFormService = TestBed.inject(SleepRecordFormService);
    sleepRecordService = TestBed.inject(SleepRecordService);
    userProfileService = TestBed.inject(UserProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call UserProfile query and add missing value', () => {
      const sleepRecord: ISleepRecord = { id: 456 };
      const userProfile: IUserProfile = { id: 90537 };
      sleepRecord.userProfile = userProfile;

      const userProfileCollection: IUserProfile[] = [{ id: 76304 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [userProfile];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ sleepRecord });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const sleepRecord: ISleepRecord = { id: 456 };
      const userProfile: IUserProfile = { id: 59524 };
      sleepRecord.userProfile = userProfile;

      activatedRoute.data = of({ sleepRecord });
      comp.ngOnInit();

      expect(comp.userProfilesSharedCollection).toContain(userProfile);
      expect(comp.sleepRecord).toEqual(sleepRecord);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISleepRecord>>();
      const sleepRecord = { id: 123 };
      jest.spyOn(sleepRecordFormService, 'getSleepRecord').mockReturnValue(sleepRecord);
      jest.spyOn(sleepRecordService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sleepRecord });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sleepRecord }));
      saveSubject.complete();

      // THEN
      expect(sleepRecordFormService.getSleepRecord).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(sleepRecordService.update).toHaveBeenCalledWith(expect.objectContaining(sleepRecord));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISleepRecord>>();
      const sleepRecord = { id: 123 };
      jest.spyOn(sleepRecordFormService, 'getSleepRecord').mockReturnValue({ id: null });
      jest.spyOn(sleepRecordService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sleepRecord: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sleepRecord }));
      saveSubject.complete();

      // THEN
      expect(sleepRecordFormService.getSleepRecord).toHaveBeenCalled();
      expect(sleepRecordService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISleepRecord>>();
      const sleepRecord = { id: 123 };
      jest.spyOn(sleepRecordService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sleepRecord });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sleepRecordService.update).toHaveBeenCalled();
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
