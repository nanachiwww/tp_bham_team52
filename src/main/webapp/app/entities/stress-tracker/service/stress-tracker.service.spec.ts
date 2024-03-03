import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IStressTracker } from '../stress-tracker.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../stress-tracker.test-samples';

import { StressTrackerService, RestStressTracker } from './stress-tracker.service';

const requireRestSample: RestStressTracker = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('StressTracker Service', () => {
  let service: StressTrackerService;
  let httpMock: HttpTestingController;
  let expectedResult: IStressTracker | IStressTracker[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StressTrackerService);
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

    it('should create a StressTracker', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const stressTracker = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(stressTracker).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a StressTracker', () => {
      const stressTracker = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(stressTracker).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a StressTracker', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of StressTracker', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a StressTracker', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addStressTrackerToCollectionIfMissing', () => {
      it('should add a StressTracker to an empty array', () => {
        const stressTracker: IStressTracker = sampleWithRequiredData;
        expectedResult = service.addStressTrackerToCollectionIfMissing([], stressTracker);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(stressTracker);
      });

      it('should not add a StressTracker to an array that contains it', () => {
        const stressTracker: IStressTracker = sampleWithRequiredData;
        const stressTrackerCollection: IStressTracker[] = [
          {
            ...stressTracker,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStressTrackerToCollectionIfMissing(stressTrackerCollection, stressTracker);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a StressTracker to an array that doesn't contain it", () => {
        const stressTracker: IStressTracker = sampleWithRequiredData;
        const stressTrackerCollection: IStressTracker[] = [sampleWithPartialData];
        expectedResult = service.addStressTrackerToCollectionIfMissing(stressTrackerCollection, stressTracker);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(stressTracker);
      });

      it('should add only unique StressTracker to an array', () => {
        const stressTrackerArray: IStressTracker[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const stressTrackerCollection: IStressTracker[] = [sampleWithRequiredData];
        expectedResult = service.addStressTrackerToCollectionIfMissing(stressTrackerCollection, ...stressTrackerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const stressTracker: IStressTracker = sampleWithRequiredData;
        const stressTracker2: IStressTracker = sampleWithPartialData;
        expectedResult = service.addStressTrackerToCollectionIfMissing([], stressTracker, stressTracker2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(stressTracker);
        expect(expectedResult).toContain(stressTracker2);
      });

      it('should accept null and undefined values', () => {
        const stressTracker: IStressTracker = sampleWithRequiredData;
        expectedResult = service.addStressTrackerToCollectionIfMissing([], null, stressTracker, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(stressTracker);
      });

      it('should return initial array if no StressTracker is added', () => {
        const stressTrackerCollection: IStressTracker[] = [sampleWithRequiredData];
        expectedResult = service.addStressTrackerToCollectionIfMissing(stressTrackerCollection, undefined, null);
        expect(expectedResult).toEqual(stressTrackerCollection);
      });
    });

    describe('compareStressTracker', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStressTracker(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareStressTracker(entity1, entity2);
        const compareResult2 = service.compareStressTracker(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareStressTracker(entity1, entity2);
        const compareResult2 = service.compareStressTracker(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareStressTracker(entity1, entity2);
        const compareResult2 = service.compareStressTracker(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
