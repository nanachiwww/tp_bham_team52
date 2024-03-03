import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IMoodTracker } from '../mood-tracker.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mood-tracker.test-samples';

import { MoodTrackerService, RestMoodTracker } from './mood-tracker.service';

const requireRestSample: RestMoodTracker = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('MoodTracker Service', () => {
  let service: MoodTrackerService;
  let httpMock: HttpTestingController;
  let expectedResult: IMoodTracker | IMoodTracker[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MoodTrackerService);
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

    it('should create a MoodTracker', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const moodTracker = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(moodTracker).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MoodTracker', () => {
      const moodTracker = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(moodTracker).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MoodTracker', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MoodTracker', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MoodTracker', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMoodTrackerToCollectionIfMissing', () => {
      it('should add a MoodTracker to an empty array', () => {
        const moodTracker: IMoodTracker = sampleWithRequiredData;
        expectedResult = service.addMoodTrackerToCollectionIfMissing([], moodTracker);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(moodTracker);
      });

      it('should not add a MoodTracker to an array that contains it', () => {
        const moodTracker: IMoodTracker = sampleWithRequiredData;
        const moodTrackerCollection: IMoodTracker[] = [
          {
            ...moodTracker,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMoodTrackerToCollectionIfMissing(moodTrackerCollection, moodTracker);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MoodTracker to an array that doesn't contain it", () => {
        const moodTracker: IMoodTracker = sampleWithRequiredData;
        const moodTrackerCollection: IMoodTracker[] = [sampleWithPartialData];
        expectedResult = service.addMoodTrackerToCollectionIfMissing(moodTrackerCollection, moodTracker);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(moodTracker);
      });

      it('should add only unique MoodTracker to an array', () => {
        const moodTrackerArray: IMoodTracker[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const moodTrackerCollection: IMoodTracker[] = [sampleWithRequiredData];
        expectedResult = service.addMoodTrackerToCollectionIfMissing(moodTrackerCollection, ...moodTrackerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const moodTracker: IMoodTracker = sampleWithRequiredData;
        const moodTracker2: IMoodTracker = sampleWithPartialData;
        expectedResult = service.addMoodTrackerToCollectionIfMissing([], moodTracker, moodTracker2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(moodTracker);
        expect(expectedResult).toContain(moodTracker2);
      });

      it('should accept null and undefined values', () => {
        const moodTracker: IMoodTracker = sampleWithRequiredData;
        expectedResult = service.addMoodTrackerToCollectionIfMissing([], null, moodTracker, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(moodTracker);
      });

      it('should return initial array if no MoodTracker is added', () => {
        const moodTrackerCollection: IMoodTracker[] = [sampleWithRequiredData];
        expectedResult = service.addMoodTrackerToCollectionIfMissing(moodTrackerCollection, undefined, null);
        expect(expectedResult).toEqual(moodTrackerCollection);
      });
    });

    describe('compareMoodTracker', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMoodTracker(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMoodTracker(entity1, entity2);
        const compareResult2 = service.compareMoodTracker(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMoodTracker(entity1, entity2);
        const compareResult2 = service.compareMoodTracker(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMoodTracker(entity1, entity2);
        const compareResult2 = service.compareMoodTracker(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
