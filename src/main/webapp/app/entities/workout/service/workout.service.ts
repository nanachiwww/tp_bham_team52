import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWorkout, NewWorkout } from '../workout.model';

export type PartialUpdateWorkout = Partial<IWorkout> & Pick<IWorkout, 'id'>;

export type EntityResponseType = HttpResponse<IWorkout>;
export type EntityArrayResponseType = HttpResponse<IWorkout[]>;

@Injectable({ providedIn: 'root' })
export class WorkoutService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/workouts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(workout: NewWorkout): Observable<EntityResponseType> {
    return this.http.post<IWorkout>(this.resourceUrl, workout, { observe: 'response' });
  }

  update(workout: IWorkout): Observable<EntityResponseType> {
    return this.http.put<IWorkout>(`${this.resourceUrl}/${this.getWorkoutIdentifier(workout)}`, workout, { observe: 'response' });
  }

  partialUpdate(workout: PartialUpdateWorkout): Observable<EntityResponseType> {
    return this.http.patch<IWorkout>(`${this.resourceUrl}/${this.getWorkoutIdentifier(workout)}`, workout, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IWorkout>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IWorkout[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getWorkoutIdentifier(workout: Pick<IWorkout, 'id'>): number {
    return workout.id;
  }

  compareWorkout(o1: Pick<IWorkout, 'id'> | null, o2: Pick<IWorkout, 'id'> | null): boolean {
    return o1 && o2 ? this.getWorkoutIdentifier(o1) === this.getWorkoutIdentifier(o2) : o1 === o2;
  }

  addWorkoutToCollectionIfMissing<Type extends Pick<IWorkout, 'id'>>(
    workoutCollection: Type[],
    ...workoutsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const workouts: Type[] = workoutsToCheck.filter(isPresent);
    if (workouts.length > 0) {
      const workoutCollectionIdentifiers = workoutCollection.map(workoutItem => this.getWorkoutIdentifier(workoutItem)!);
      const workoutsToAdd = workouts.filter(workoutItem => {
        const workoutIdentifier = this.getWorkoutIdentifier(workoutItem);
        if (workoutCollectionIdentifiers.includes(workoutIdentifier)) {
          return false;
        }
        workoutCollectionIdentifiers.push(workoutIdentifier);
        return true;
      });
      return [...workoutsToAdd, ...workoutCollection];
    }
    return workoutCollection;
  }
}
