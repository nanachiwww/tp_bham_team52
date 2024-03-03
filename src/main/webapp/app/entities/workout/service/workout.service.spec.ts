import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IWorkout } from '../workout.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../workout.test-samples';

import { WorkoutService } from './workout.service';

const requireRestSample: IWorkout = {
  ...sampleWithRequiredData,
};

describe('Workout Service', () => {
  let service: WorkoutService;
  let httpMock: HttpTestingController;
  let expectedResult: IWorkout | IWorkout[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(WorkoutService);
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

    it('should create a Workout', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const workout = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(workout).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Workout', () => {
      const workout = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(workout).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Workout', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Workout', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Workout', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addWorkoutToCollectionIfMissing', () => {
      it('should add a Workout to an empty array', () => {
        const workout: IWorkout = sampleWithRequiredData;
        expectedResult = service.addWorkoutToCollectionIfMissing([], workout);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(workout);
      });

      it('should not add a Workout to an array that contains it', () => {
        const workout: IWorkout = sampleWithRequiredData;
        const workoutCollection: IWorkout[] = [
          {
            ...workout,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addWorkoutToCollectionIfMissing(workoutCollection, workout);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Workout to an array that doesn't contain it", () => {
        const workout: IWorkout = sampleWithRequiredData;
        const workoutCollection: IWorkout[] = [sampleWithPartialData];
        expectedResult = service.addWorkoutToCollectionIfMissing(workoutCollection, workout);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(workout);
      });

      it('should add only unique Workout to an array', () => {
        const workoutArray: IWorkout[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const workoutCollection: IWorkout[] = [sampleWithRequiredData];
        expectedResult = service.addWorkoutToCollectionIfMissing(workoutCollection, ...workoutArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const workout: IWorkout = sampleWithRequiredData;
        const workout2: IWorkout = sampleWithPartialData;
        expectedResult = service.addWorkoutToCollectionIfMissing([], workout, workout2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(workout);
        expect(expectedResult).toContain(workout2);
      });

      it('should accept null and undefined values', () => {
        const workout: IWorkout = sampleWithRequiredData;
        expectedResult = service.addWorkoutToCollectionIfMissing([], null, workout, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(workout);
      });

      it('should return initial array if no Workout is added', () => {
        const workoutCollection: IWorkout[] = [sampleWithRequiredData];
        expectedResult = service.addWorkoutToCollectionIfMissing(workoutCollection, undefined, null);
        expect(expectedResult).toEqual(workoutCollection);
      });
    });

    describe('compareWorkout', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareWorkout(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareWorkout(entity1, entity2);
        const compareResult2 = service.compareWorkout(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareWorkout(entity1, entity2);
        const compareResult2 = service.compareWorkout(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareWorkout(entity1, entity2);
        const compareResult2 = service.compareWorkout(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
