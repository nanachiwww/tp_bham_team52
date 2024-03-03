import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDashboard } from '../dashboard.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../dashboard.test-samples';

import { DashboardService } from './dashboard.service';

const requireRestSample: IDashboard = {
  ...sampleWithRequiredData,
};

describe('Dashboard Service', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;
  let expectedResult: IDashboard | IDashboard[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Dashboard', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const dashboard = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(dashboard).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Dashboard', () => {
      const dashboard = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(dashboard).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Dashboard', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Dashboard', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Dashboard', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDashboardToCollectionIfMissing', () => {
      it('should add a Dashboard to an empty array', () => {
        const dashboard: IDashboard = sampleWithRequiredData;
        expectedResult = service.addDashboardToCollectionIfMissing([], dashboard);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(dashboard);
      });

      it('should not add a Dashboard to an array that contains it', () => {
        const dashboard: IDashboard = sampleWithRequiredData;
        const dashboardCollection: IDashboard[] = [
          {
            ...dashboard,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDashboardToCollectionIfMissing(dashboardCollection, dashboard);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Dashboard to an array that doesn't contain it", () => {
        const dashboard: IDashboard = sampleWithRequiredData;
        const dashboardCollection: IDashboard[] = [sampleWithPartialData];
        expectedResult = service.addDashboardToCollectionIfMissing(dashboardCollection, dashboard);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(dashboard);
      });

      it('should add only unique Dashboard to an array', () => {
        const dashboardArray: IDashboard[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const dashboardCollection: IDashboard[] = [sampleWithRequiredData];
        expectedResult = service.addDashboardToCollectionIfMissing(dashboardCollection, ...dashboardArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const dashboard: IDashboard = sampleWithRequiredData;
        const dashboard2: IDashboard = sampleWithPartialData;
        expectedResult = service.addDashboardToCollectionIfMissing([], dashboard, dashboard2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(dashboard);
        expect(expectedResult).toContain(dashboard2);
      });

      it('should accept null and undefined values', () => {
        const dashboard: IDashboard = sampleWithRequiredData;
        expectedResult = service.addDashboardToCollectionIfMissing([], null, dashboard, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(dashboard);
      });

      it('should return initial array if no Dashboard is added', () => {
        const dashboardCollection: IDashboard[] = [sampleWithRequiredData];
        expectedResult = service.addDashboardToCollectionIfMissing(dashboardCollection, undefined, null);
        expect(expectedResult).toEqual(dashboardCollection);
      });
    });

    describe('compareDashboard', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDashboard(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDashboard(entity1, entity2);
        const compareResult2 = service.compareDashboard(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDashboard(entity1, entity2);
        const compareResult2 = service.compareDashboard(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDashboard(entity1, entity2);
        const compareResult2 = service.compareDashboard(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
