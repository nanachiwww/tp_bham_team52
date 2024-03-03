import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IEnergyIntakeResult } from '../energy-intake-result.model';
import { EnergyIntakeResultService } from '../service/energy-intake-result.service';

import { EnergyIntakeResultRoutingResolveService } from './energy-intake-result-routing-resolve.service';

describe('EnergyIntakeResult routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: EnergyIntakeResultRoutingResolveService;
  let service: EnergyIntakeResultService;
  let resultEnergyIntakeResult: IEnergyIntakeResult | null | undefined;

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
    routingResolveService = TestBed.inject(EnergyIntakeResultRoutingResolveService);
    service = TestBed.inject(EnergyIntakeResultService);
    resultEnergyIntakeResult = undefined;
  });

  describe('resolve', () => {
    it('should return IEnergyIntakeResult returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEnergyIntakeResult = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEnergyIntakeResult).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEnergyIntakeResult = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultEnergyIntakeResult).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IEnergyIntakeResult>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultEnergyIntakeResult = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultEnergyIntakeResult).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
