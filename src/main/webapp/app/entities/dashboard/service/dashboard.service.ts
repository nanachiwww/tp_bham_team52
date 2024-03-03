import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDashboard, NewDashboard } from '../dashboard.model';

export type PartialUpdateDashboard = Partial<IDashboard> & Pick<IDashboard, 'id'>;

export type EntityResponseType = HttpResponse<IDashboard>;
export type EntityArrayResponseType = HttpResponse<IDashboard[]>;

@Injectable({ providedIn: 'root' })
export class DashboardService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/dashboards');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(dashboard: NewDashboard): Observable<EntityResponseType> {
    return this.http.post<IDashboard>(this.resourceUrl, dashboard, { observe: 'response' });
  }

  update(dashboard: IDashboard): Observable<EntityResponseType> {
    return this.http.put<IDashboard>(`${this.resourceUrl}/${this.getDashboardIdentifier(dashboard)}`, dashboard, { observe: 'response' });
  }

  partialUpdate(dashboard: PartialUpdateDashboard): Observable<EntityResponseType> {
    return this.http.patch<IDashboard>(`${this.resourceUrl}/${this.getDashboardIdentifier(dashboard)}`, dashboard, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDashboard>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDashboard[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDashboardIdentifier(dashboard: Pick<IDashboard, 'id'>): number {
    return dashboard.id;
  }

  compareDashboard(o1: Pick<IDashboard, 'id'> | null, o2: Pick<IDashboard, 'id'> | null): boolean {
    return o1 && o2 ? this.getDashboardIdentifier(o1) === this.getDashboardIdentifier(o2) : o1 === o2;
  }

  addDashboardToCollectionIfMissing<Type extends Pick<IDashboard, 'id'>>(
    dashboardCollection: Type[],
    ...dashboardsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const dashboards: Type[] = dashboardsToCheck.filter(isPresent);
    if (dashboards.length > 0) {
      const dashboardCollectionIdentifiers = dashboardCollection.map(dashboardItem => this.getDashboardIdentifier(dashboardItem)!);
      const dashboardsToAdd = dashboards.filter(dashboardItem => {
        const dashboardIdentifier = this.getDashboardIdentifier(dashboardItem);
        if (dashboardCollectionIdentifiers.includes(dashboardIdentifier)) {
          return false;
        }
        dashboardCollectionIdentifiers.push(dashboardIdentifier);
        return true;
      });
      return [...dashboardsToAdd, ...dashboardCollection];
    }
    return dashboardCollection;
  }
}
