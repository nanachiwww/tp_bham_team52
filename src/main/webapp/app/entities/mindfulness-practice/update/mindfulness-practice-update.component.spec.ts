import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MindfulnessPracticeFormService } from './mindfulness-practice-form.service';
import { MindfulnessPracticeService } from '../service/mindfulness-practice.service';
import { IMindfulnessPractice } from '../mindfulness-practice.model';
import { IMindfulnessTip } from 'app/entities/mindfulness-tip/mindfulness-tip.model';
import { MindfulnessTipService } from 'app/entities/mindfulness-tip/service/mindfulness-tip.service';
import { IUserProfile } from 'app/entities/user-profile/user-profile.model';
import { UserProfileService } from 'app/entities/user-profile/service/user-profile.service';

import { MindfulnessPracticeUpdateComponent } from './mindfulness-practice-update.component';

describe('MindfulnessPractice Management Update Component', () => {
  let comp: MindfulnessPracticeUpdateComponent;
  let fixture: ComponentFixture<MindfulnessPracticeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mindfulnessPracticeFormService: MindfulnessPracticeFormService;
  let mindfulnessPracticeService: MindfulnessPracticeService;
  let mindfulnessTipService: MindfulnessTipService;
  let userProfileService: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MindfulnessPracticeUpdateComponent],
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
      .overrideTemplate(MindfulnessPracticeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MindfulnessPracticeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mindfulnessPracticeFormService = TestBed.inject(MindfulnessPracticeFormService);
    mindfulnessPracticeService = TestBed.inject(MindfulnessPracticeService);
    mindfulnessTipService = TestBed.inject(MindfulnessTipService);
    userProfileService = TestBed.inject(UserProfileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call MindfulnessTip query and add missing value', () => {
      const mindfulnessPractice: IMindfulnessPractice = { id: 456 };
      const mindfulnessTip: IMindfulnessTip = { id: 69242 };
      mindfulnessPractice.mindfulnessTip = mindfulnessTip;

      const mindfulnessTipCollection: IMindfulnessTip[] = [{ id: 66857 }];
      jest.spyOn(mindfulnessTipService, 'query').mockReturnValue(of(new HttpResponse({ body: mindfulnessTipCollection })));
      const additionalMindfulnessTips = [mindfulnessTip];
      const expectedCollection: IMindfulnessTip[] = [...additionalMindfulnessTips, ...mindfulnessTipCollection];
      jest.spyOn(mindfulnessTipService, 'addMindfulnessTipToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mindfulnessPractice });
      comp.ngOnInit();

      expect(mindfulnessTipService.query).toHaveBeenCalled();
      expect(mindfulnessTipService.addMindfulnessTipToCollectionIfMissing).toHaveBeenCalledWith(
        mindfulnessTipCollection,
        ...additionalMindfulnessTips.map(expect.objectContaining)
      );
      expect(comp.mindfulnessTipsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call UserProfile query and add missing value', () => {
      const mindfulnessPractice: IMindfulnessPractice = { id: 456 };
      const userProfile: IUserProfile = { id: 56244 };
      mindfulnessPractice.userProfile = userProfile;

      const userProfileCollection: IUserProfile[] = [{ id: 25831 }];
      jest.spyOn(userProfileService, 'query').mockReturnValue(of(new HttpResponse({ body: userProfileCollection })));
      const additionalUserProfiles = [userProfile];
      const expectedCollection: IUserProfile[] = [...additionalUserProfiles, ...userProfileCollection];
      jest.spyOn(userProfileService, 'addUserProfileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ mindfulnessPractice });
      comp.ngOnInit();

      expect(userProfileService.query).toHaveBeenCalled();
      expect(userProfileService.addUserProfileToCollectionIfMissing).toHaveBeenCalledWith(
        userProfileCollection,
        ...additionalUserProfiles.map(expect.objectContaining)
      );
      expect(comp.userProfilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const mindfulnessPractice: IMindfulnessPractice = { id: 456 };
      const mindfulnessTip: IMindfulnessTip = { id: 49626 };
      mindfulnessPractice.mindfulnessTip = mindfulnessTip;
      const userProfile: IUserProfile = { id: 92460 };
      mindfulnessPractice.userProfile = userProfile;

      activatedRoute.data = of({ mindfulnessPractice });
      comp.ngOnInit();

      expect(comp.mindfulnessTipsSharedCollection).toContain(mindfulnessTip);
      expect(comp.userProfilesSharedCollection).toContain(userProfile);
      expect(comp.mindfulnessPractice).toEqual(mindfulnessPractice);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMindfulnessPractice>>();
      const mindfulnessPractice = { id: 123 };
      jest.spyOn(mindfulnessPracticeFormService, 'getMindfulnessPractice').mockReturnValue(mindfulnessPractice);
      jest.spyOn(mindfulnessPracticeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mindfulnessPractice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mindfulnessPractice }));
      saveSubject.complete();

      // THEN
      expect(mindfulnessPracticeFormService.getMindfulnessPractice).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(mindfulnessPracticeService.update).toHaveBeenCalledWith(expect.objectContaining(mindfulnessPractice));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMindfulnessPractice>>();
      const mindfulnessPractice = { id: 123 };
      jest.spyOn(mindfulnessPracticeFormService, 'getMindfulnessPractice').mockReturnValue({ id: null });
      jest.spyOn(mindfulnessPracticeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mindfulnessPractice: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mindfulnessPractice }));
      saveSubject.complete();

      // THEN
      expect(mindfulnessPracticeFormService.getMindfulnessPractice).toHaveBeenCalled();
      expect(mindfulnessPracticeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMindfulnessPractice>>();
      const mindfulnessPractice = { id: 123 };
      jest.spyOn(mindfulnessPracticeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mindfulnessPractice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mindfulnessPracticeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareMindfulnessTip', () => {
      it('Should forward to mindfulnessTipService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(mindfulnessTipService, 'compareMindfulnessTip');
        comp.compareMindfulnessTip(entity, entity2);
        expect(mindfulnessTipService.compareMindfulnessTip).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
