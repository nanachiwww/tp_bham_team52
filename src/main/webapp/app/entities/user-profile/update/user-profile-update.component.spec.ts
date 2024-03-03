import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserProfileFormService } from './user-profile-form.service';
import { UserProfileService } from '../service/user-profile.service';
import { IUserProfile } from '../user-profile.model';
import { IDashboard } from 'app/entities/dashboard/dashboard.model';
import { DashboardService } from 'app/entities/dashboard/service/dashboard.service';
import { ICompareResult } from 'app/entities/compare-result/compare-result.model';
import { CompareResultService } from 'app/entities/compare-result/service/compare-result.service';

import { UserProfileUpdateComponent } from './user-profile-update.component';

describe('UserProfile Management Update Component', () => {
  let comp: UserProfileUpdateComponent;
  let fixture: ComponentFixture<UserProfileUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userProfileFormService: UserProfileFormService;
  let userProfileService: UserProfileService;
  let dashboardService: DashboardService;
  let compareResultService: CompareResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserProfileUpdateComponent],
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
      .overrideTemplate(UserProfileUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserProfileUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userProfileFormService = TestBed.inject(UserProfileFormService);
    userProfileService = TestBed.inject(UserProfileService);
    dashboardService = TestBed.inject(DashboardService);
    compareResultService = TestBed.inject(CompareResultService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Dashboard query and add missing value', () => {
      const userProfile: IUserProfile = { id: 456 };
      const dashboard: IDashboard = { id: 76447 };
      userProfile.dashboard = dashboard;

      const dashboardCollection: IDashboard[] = [{ id: 12963 }];
      jest.spyOn(dashboardService, 'query').mockReturnValue(of(new HttpResponse({ body: dashboardCollection })));
      const additionalDashboards = [dashboard];
      const expectedCollection: IDashboard[] = [...additionalDashboards, ...dashboardCollection];
      jest.spyOn(dashboardService, 'addDashboardToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userProfile });
      comp.ngOnInit();

      expect(dashboardService.query).toHaveBeenCalled();
      expect(dashboardService.addDashboardToCollectionIfMissing).toHaveBeenCalledWith(
        dashboardCollection,
        ...additionalDashboards.map(expect.objectContaining)
      );
      expect(comp.dashboardsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call compareResult query and add missing value', () => {
      const userProfile: IUserProfile = { id: 456 };
      const compareResult: ICompareResult = { id: 99918 };
      userProfile.compareResult = compareResult;

      const compareResultCollection: ICompareResult[] = [{ id: 38788 }];
      jest.spyOn(compareResultService, 'query').mockReturnValue(of(new HttpResponse({ body: compareResultCollection })));
      const expectedCollection: ICompareResult[] = [compareResult, ...compareResultCollection];
      jest.spyOn(compareResultService, 'addCompareResultToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userProfile });
      comp.ngOnInit();

      expect(compareResultService.query).toHaveBeenCalled();
      expect(compareResultService.addCompareResultToCollectionIfMissing).toHaveBeenCalledWith(compareResultCollection, compareResult);
      expect(comp.compareResultsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userProfile: IUserProfile = { id: 456 };
      const dashboard: IDashboard = { id: 28782 };
      userProfile.dashboard = dashboard;
      const compareResult: ICompareResult = { id: 83835 };
      userProfile.compareResult = compareResult;

      activatedRoute.data = of({ userProfile });
      comp.ngOnInit();

      expect(comp.dashboardsSharedCollection).toContain(dashboard);
      expect(comp.compareResultsCollection).toContain(compareResult);
      expect(comp.userProfile).toEqual(userProfile);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserProfile>>();
      const userProfile = { id: 123 };
      jest.spyOn(userProfileFormService, 'getUserProfile').mockReturnValue(userProfile);
      jest.spyOn(userProfileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userProfile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userProfile }));
      saveSubject.complete();

      // THEN
      expect(userProfileFormService.getUserProfile).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userProfileService.update).toHaveBeenCalledWith(expect.objectContaining(userProfile));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserProfile>>();
      const userProfile = { id: 123 };
      jest.spyOn(userProfileFormService, 'getUserProfile').mockReturnValue({ id: null });
      jest.spyOn(userProfileService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userProfile: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userProfile }));
      saveSubject.complete();

      // THEN
      expect(userProfileFormService.getUserProfile).toHaveBeenCalled();
      expect(userProfileService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserProfile>>();
      const userProfile = { id: 123 };
      jest.spyOn(userProfileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userProfile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userProfileService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDashboard', () => {
      it('Should forward to dashboardService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(dashboardService, 'compareDashboard');
        comp.compareDashboard(entity, entity2);
        expect(dashboardService.compareDashboard).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCompareResult', () => {
      it('Should forward to compareResultService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(compareResultService, 'compareCompareResult');
        comp.compareCompareResult(entity, entity2);
        expect(compareResultService.compareCompareResult).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
