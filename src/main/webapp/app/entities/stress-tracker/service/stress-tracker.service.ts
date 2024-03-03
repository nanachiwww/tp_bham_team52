import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStressTracker, NewStressTracker } from '../stress-tracker.model';

export type PartialUpdateStressTracker = Partial<IStressTracker> & Pick<IStressTracker, 'id'>;

type RestOf<T extends IStressTracker | NewStressTracker> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestStressTracker = RestOf<IStressTracker>;

export type NewRestStressTracker = RestOf<NewStressTracker>;

export type PartialUpdateRestStressTracker = RestOf<PartialUpdateStressTracker>;

export type EntityResponseType = HttpResponse<IStressTracker>;
export type EntityArrayResponseType = HttpResponse<IStressTracker[]>;

@Injectable({ providedIn: 'root' })
export class StressTrackerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/stress-trackers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(stressTracker: NewStressTracker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(stressTracker);
    return this.http
      .post<RestStressTracker>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(stressTracker: IStressTracker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(stressTracker);
    return this.http
      .put<RestStressTracker>(`${this.resourceUrl}/${this.getStressTrackerIdentifier(stressTracker)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(stressTracker: PartialUpdateStressTracker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(stressTracker);
    return this.http
      .patch<RestStressTracker>(`${this.resourceUrl}/${this.getStressTrackerIdentifier(stressTracker)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestStressTracker>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestStressTracker[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStressTrackerIdentifier(stressTracker: Pick<IStressTracker, 'id'>): number {
    return stressTracker.id;
  }

  compareStressTracker(o1: Pick<IStressTracker, 'id'> | null, o2: Pick<IStressTracker, 'id'> | null): boolean {
    return o1 && o2 ? this.getStressTrackerIdentifier(o1) === this.getStressTrackerIdentifier(o2) : o1 === o2;
  }

  addStressTrackerToCollectionIfMissing<Type extends Pick<IStressTracker, 'id'>>(
    stressTrackerCollection: Type[],
    ...stressTrackersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const stressTrackers: Type[] = stressTrackersToCheck.filter(isPresent);
    if (stressTrackers.length > 0) {
      const stressTrackerCollectionIdentifiers = stressTrackerCollection.map(
        stressTrackerItem => this.getStressTrackerIdentifier(stressTrackerItem)!
      );
      const stressTrackersToAdd = stressTrackers.filter(stressTrackerItem => {
        const stressTrackerIdentifier = this.getStressTrackerIdentifier(stressTrackerItem);
        if (stressTrackerCollectionIdentifiers.includes(stressTrackerIdentifier)) {
          return false;
        }
        stressTrackerCollectionIdentifiers.push(stressTrackerIdentifier);
        return true;
      });
      return [...stressTrackersToAdd, ...stressTrackerCollection];
    }
    return stressTrackerCollection;
  }

  protected convertDateFromClient<T extends IStressTracker | NewStressTracker | PartialUpdateStressTracker>(stressTracker: T): RestOf<T> {
    return {
      ...stressTracker,
      date: stressTracker.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restStressTracker: RestStressTracker): IStressTracker {
    return {
      ...restStressTracker,
      date: restStressTracker.date ? dayjs(restStressTracker.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestStressTracker>): HttpResponse<IStressTracker> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestStressTracker[]>): HttpResponse<IStressTracker[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
