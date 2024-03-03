import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IMedicine } from '../medicine.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../medicine.test-samples';

import { MedicineService, RestMedicine } from './medicine.service';

const requireRestSample: RestMedicine = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('Medicine Service', () => {
  let service: MedicineService;
  let httpMock: HttpTestingController;
  let expectedResult: IMedicine | IMedicine[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MedicineService);
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

    it('should create a Medicine', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const medicine = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(medicine).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Medicine', () => {
      const medicine = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(medicine).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Medicine', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Medicine', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Medicine', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMedicineToCollectionIfMissing', () => {
      it('should add a Medicine to an empty array', () => {
        const medicine: IMedicine = sampleWithRequiredData;
        expectedResult = service.addMedicineToCollectionIfMissing([], medicine);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(medicine);
      });

      it('should not add a Medicine to an array that contains it', () => {
        const medicine: IMedicine = sampleWithRequiredData;
        const medicineCollection: IMedicine[] = [
          {
            ...medicine,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMedicineToCollectionIfMissing(medicineCollection, medicine);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Medicine to an array that doesn't contain it", () => {
        const medicine: IMedicine = sampleWithRequiredData;
        const medicineCollection: IMedicine[] = [sampleWithPartialData];
        expectedResult = service.addMedicineToCollectionIfMissing(medicineCollection, medicine);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(medicine);
      });

      it('should add only unique Medicine to an array', () => {
        const medicineArray: IMedicine[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const medicineCollection: IMedicine[] = [sampleWithRequiredData];
        expectedResult = service.addMedicineToCollectionIfMissing(medicineCollection, ...medicineArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const medicine: IMedicine = sampleWithRequiredData;
        const medicine2: IMedicine = sampleWithPartialData;
        expectedResult = service.addMedicineToCollectionIfMissing([], medicine, medicine2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(medicine);
        expect(expectedResult).toContain(medicine2);
      });

      it('should accept null and undefined values', () => {
        const medicine: IMedicine = sampleWithRequiredData;
        expectedResult = service.addMedicineToCollectionIfMissing([], null, medicine, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(medicine);
      });

      it('should return initial array if no Medicine is added', () => {
        const medicineCollection: IMedicine[] = [sampleWithRequiredData];
        expectedResult = service.addMedicineToCollectionIfMissing(medicineCollection, undefined, null);
        expect(expectedResult).toEqual(medicineCollection);
      });
    });

    describe('compareMedicine', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMedicine(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMedicine(entity1, entity2);
        const compareResult2 = service.compareMedicine(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMedicine(entity1, entity2);
        const compareResult2 = service.compareMedicine(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMedicine(entity1, entity2);
        const compareResult2 = service.compareMedicine(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
