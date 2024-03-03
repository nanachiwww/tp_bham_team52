import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IMindfulnessPractice } from '../mindfulness-practice.model';
import { MindfulnessPracticeService } from '../service/mindfulness-practice.service';

import { MindfulnessPracticeRoutingResolveService } from './mindfulness-practice-routing-resolve.service';

describe('MindfulnessPractice routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: MindfulnessPracticeRoutingResolveService;
  let service: MindfulnessPracticeService;
  let resultMindfulnessPractice: IMindfulnessPractice | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(MindfulnessPracticeRoutingResolveService);
    service = TestBed.inject(MindfulnessPracticeService);
    resultMindfulnessPractice = undefined;
  });

  describe('resolve', () => {
    it('should return IMindfulnessPractice returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultMindfulnessPractice = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultMindfulnessPractice).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultMindfulnessPractice = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultMindfulnessPractice).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IMindfulnessPractice>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultMindfulnessPractice = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultMindfulnessPractice).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
