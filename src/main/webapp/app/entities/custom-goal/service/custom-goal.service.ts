import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICustomGoal, NewCustomGoal } from '../custom-goal.model';

export type PartialUpdateCustomGoal = Partial<ICustomGoal> & Pick<ICustomGoal, 'id'>;

export type EntityResponseType = HttpResponse<ICustomGoal>;
export type EntityArrayResponseType = HttpResponse<ICustomGoal[]>;

@Injectable({ providedIn: 'root' })
export class CustomGoalService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/custom-goals');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(customGoal: Omit<ICustomGoal, 'id'> & { id: null }): Observable<EntityResponseType> {
    return this.http.post<ICustomGoal>(this.resourceUrl, customGoal, { observe: 'response' });
  }

  update(customGoal: ICustomGoal): Observable<EntityResponseType> {
    return this.http.put<ICustomGoal>(`${this.resourceUrl}/${this.getCustomGoalIdentifier(customGoal)}`, customGoal, {
      observe: 'response',
    });
  }

  partialUpdate(customGoal: PartialUpdateCustomGoal): Observable<EntityResponseType> {
    return this.http.patch<ICustomGoal>(`${this.resourceUrl}/${this.getCustomGoalIdentifier(customGoal)}`, customGoal, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICustomGoal>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICustomGoal[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCustomGoalIdentifier(customGoal: PartialUpdateCustomGoal): number {
    return customGoal.id;
  }

  compareCustomGoal(o1: Pick<ICustomGoal, 'id'> | null, o2: Pick<ICustomGoal, 'id'> | null): boolean {
    return o1 && o2 ? this.getCustomGoalIdentifier(o1) === this.getCustomGoalIdentifier(o2) : o1 === o2;
  }

  addCustomGoalToCollectionIfMissing<Type extends Pick<ICustomGoal, 'id'>>(
    customGoalCollection: Type[],
    ...customGoalsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const customGoals: Type[] = customGoalsToCheck.filter(isPresent);
    if (customGoals.length > 0) {
      const customGoalCollectionIdentifiers = customGoalCollection.map(customGoalItem => this.getCustomGoalIdentifier(customGoalItem)!);
      const customGoalsToAdd = customGoals.filter(customGoalItem => {
        const customGoalIdentifier = this.getCustomGoalIdentifier(customGoalItem);
        if (customGoalCollectionIdentifiers.includes(customGoalIdentifier)) {
          return false;
        }
        customGoalCollectionIdentifiers.push(customGoalIdentifier);
        return true;
      });
      return [...customGoalsToAdd, ...customGoalCollection];
    }
    return customGoalCollection;
  }
}
