import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISleepRecord } from '../sleep-record.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../sleep-record.test-samples';

import { SleepRecordService, RestSleepRecord } from './sleep-record.service';

const requireRestSample: RestSleepRecord = {
  ...sampleWithRequiredData,
  startTime: sampleWithRequiredData.startTime?.toJSON(),
  endTime: sampleWithRequiredData.endTime?.toJSON(),
};

describe('SleepRecord Service', () => {
  let service: SleepRecordService;
  let httpMock: HttpTestingController;
  let expectedResult: ISleepRecord | ISleepRecord[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SleepRecordService);
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

    it('should create a SleepRecord', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const sleepRecord = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(sleepRecord).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SleepRecord', () => {
      const sleepRecord = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(sleepRecord).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SleepRecord', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SleepRecord', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SleepRecord', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSleepRecordToCollectionIfMissing', () => {
      it('should add a SleepRecord to an empty array', () => {
        const sleepRecord: ISleepRecord = sampleWithRequiredData;
        expectedResult = service.addSleepRecordToCollectionIfMissing([], sleepRecord);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sleepRecord);
      });

      it('should not add a SleepRecord to an array that contains it', () => {
        const sleepRecord: ISleepRecord = sampleWithRequiredData;
        const sleepRecordCollection: ISleepRecord[] = [
          {
            ...sleepRecord,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSleepRecordToCollectionIfMissing(sleepRecordCollection, sleepRecord);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SleepRecord to an array that doesn't contain it", () => {
        const sleepRecord: ISleepRecord = sampleWithRequiredData;
        const sleepRecordCollection: ISleepRecord[] = [sampleWithPartialData];
        expectedResult = service.addSleepRecordToCollectionIfMissing(sleepRecordCollection, sleepRecord);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sleepRecord);
      });

      it('should add only unique SleepRecord to an array', () => {
        const sleepRecordArray: ISleepRecord[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const sleepRecordCollection: ISleepRecord[] = [sampleWithRequiredData];
        expectedResult = service.addSleepRecordToCollectionIfMissing(sleepRecordCollection, ...sleepRecordArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sleepRecord: ISleepRecord = sampleWithRequiredData;
        const sleepRecord2: ISleepRecord = sampleWithPartialData;
        expectedResult = service.addSleepRecordToCollectionIfMissing([], sleepRecord, sleepRecord2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sleepRecord);
        expect(expectedResult).toContain(sleepRecord2);
      });

      it('should accept null and undefined values', () => {
        const sleepRecord: ISleepRecord = sampleWithRequiredData;
        expectedResult = service.addSleepRecordToCollectionIfMissing([], null, sleepRecord, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sleepRecord);
      });

      it('should return initial array if no SleepRecord is added', () => {
        const sleepRecordCollection: ISleepRecord[] = [sampleWithRequiredData];
        expectedResult = service.addSleepRecordToCollectionIfMissing(sleepRecordCollection, undefined, null);
        expect(expectedResult).toEqual(sleepRecordCollection);
      });
    });

    describe('compareSleepRecord', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSleepRecord(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSleepRecord(entity1, entity2);
        const compareResult2 = service.compareSleepRecord(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSleepRecord(entity1, entity2);
        const compareResult2 = service.compareSleepRecord(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSleepRecord(entity1, entity2);
        const compareResult2 = service.compareSleepRecord(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
