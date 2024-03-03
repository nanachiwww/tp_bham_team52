import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMindfulnessTip } from '../mindfulness-tip.model';
import { MindfulnessTipService } from '../service/mindfulness-tip.service';

@Injectable({ providedIn: 'root' })
export class MindfulnessTipRoutingResolveService implements Resolve<IMindfulnessTip | null> {
  constructor(protected service: MindfulnessTipService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMindfulnessTip | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mindfulnessTip: HttpResponse<IMindfulnessTip>) => {
          if (mindfulnessTip.body) {
            return of(mindfulnessTip.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
