import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMoodTracker, NewMoodTracker } from '../mood-tracker.model';

export type PartialUpdateMoodTracker = Partial<IMoodTracker> & Pick<IMoodTracker, 'id'>;

type RestOf<T extends IMoodTracker | NewMoodTracker> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestMoodTracker = RestOf<IMoodTracker>;

export type NewRestMoodTracker = RestOf<NewMoodTracker>;

export type PartialUpdateRestMoodTracker = RestOf<PartialUpdateMoodTracker>;

export type EntityResponseType = HttpResponse<IMoodTracker>;
export type EntityArrayResponseType = HttpResponse<IMoodTracker[]>;

@Injectable({ providedIn: 'root' })
export class MoodTrackerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mood-trackers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(moodTracker: NewMoodTracker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(moodTracker);
    return this.http
      .post<RestMoodTracker>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(moodTracker: IMoodTracker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(moodTracker);
    return this.http
      .put<RestMoodTracker>(`${this.resourceUrl}/${this.getMoodTrackerIdentifier(moodTracker)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(moodTracker: PartialUpdateMoodTracker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(moodTracker);
    return this.http
      .patch<RestMoodTracker>(`${this.resourceUrl}/${this.getMoodTrackerIdentifier(moodTracker)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestMoodTracker>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMoodTracker[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMoodTrackerIdentifier(moodTracker: Pick<IMoodTracker, 'id'>): number {
    if (moodTracker.id === null || moodTracker.id === undefined) {
      throw new Error('Mood tracker id is null or undefined');
    }
    return moodTracker.id;
  }

  compareMoodTracker(o1: Pick<IMoodTracker, 'id'> | null, o2: Pick<IMoodTracker, 'id'> | null): boolean {
    return o1 && o2 ? this.getMoodTrackerIdentifier(o1) === this.getMoodTrackerIdentifier(o2) : o1 === o2;
  }

  addMoodTrackerToCollectionIfMissing<Type extends Pick<IMoodTracker, 'id'>>(
    moodTrackerCollection: Type[],
    ...moodTrackersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const moodTrackers: Type[] = moodTrackersToCheck.filter(isPresent);
    if (moodTrackers.length > 0) {
      const moodTrackerCollectionIdentifiers = moodTrackerCollection.map(
        moodTrackerItem => this.getMoodTrackerIdentifier(moodTrackerItem)!
      );
      const moodTrackersToAdd = moodTrackers.filter(moodTrackerItem => {
        const moodTrackerIdentifier = this.getMoodTrackerIdentifier(moodTrackerItem);
        if (moodTrackerCollectionIdentifiers.includes(moodTrackerIdentifier)) {
          return false;
        }
        moodTrackerCollectionIdentifiers.push(moodTrackerIdentifier);
        return true;
      });
      return [...moodTrackersToAdd, ...moodTrackerCollection];
    }
    return moodTrackerCollection;
  }

  protected convertDateFromClient<T extends IMoodTracker | NewMoodTracker | PartialUpdateMoodTracker>(moodTracker: T): RestOf<T> {
    return {
      ...moodTracker,
      date: moodTracker.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restMoodTracker: RestMoodTracker): IMoodTracker {
    return {
      ...restMoodTracker,
      date: restMoodTracker.date ? dayjs(restMoodTracker.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestMoodTracker>): HttpResponse<IMoodTracker> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestMoodTracker[]>): HttpResponse<IMoodTracker[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
