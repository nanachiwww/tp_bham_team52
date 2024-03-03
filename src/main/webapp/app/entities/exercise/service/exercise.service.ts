import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExercise, NewExercise } from '../exercise.model';

export type PartialUpdateExercise = Partial<IExercise> & Pick<IExercise, 'id'>;

export type EntityResponseType = HttpResponse<IExercise>;
export type EntityArrayResponseType = HttpResponse<IExercise[]>;

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/exercises');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(exercise: NewExercise): Observable<EntityResponseType> {
    return this.http.post<IExercise>(this.resourceUrl, exercise, { observe: 'response' });
  }

  update(exercise: IExercise): Observable<EntityResponseType> {
    return this.http.put<IExercise>(`${this.resourceUrl}/${this.getExerciseIdentifier(exercise)}`, exercise, { observe: 'response' });
  }

  partialUpdate(exercise: PartialUpdateExercise): Observable<EntityResponseType> {
    return this.http.patch<IExercise>(`${this.resourceUrl}/${this.getExerciseIdentifier(exercise)}`, exercise, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IExercise>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IExercise[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getExerciseIdentifier(exercise: Pick<IExercise, 'id'>): number {
    return exercise.id;
  }

  compareExercise(o1: Pick<IExercise, 'id'> | null, o2: Pick<IExercise, 'id'> | null): boolean {
    return o1 && o2 ? this.getExerciseIdentifier(o1) === this.getExerciseIdentifier(o2) : o1 === o2;
  }

  addExerciseToCollectionIfMissing<Type extends Pick<IExercise, 'id'>>(
    exerciseCollection: Type[],
    ...exercisesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const exercises: Type[] = exercisesToCheck.filter(isPresent);
    if (exercises.length > 0) {
      const exerciseCollectionIdentifiers = exerciseCollection.map(exerciseItem => this.getExerciseIdentifier(exerciseItem)!);
      const exercisesToAdd = exercises.filter(exerciseItem => {
        const exerciseIdentifier = this.getExerciseIdentifier(exerciseItem);
        if (exerciseCollectionIdentifiers.includes(exerciseIdentifier)) {
          return false;
        }
        exerciseCollectionIdentifiers.push(exerciseIdentifier);
        return true;
      });
      return [...exercisesToAdd, ...exerciseCollection];
    }
    return exerciseCollection;
  }
}
