import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMindfulnessPractice } from '../mindfulness-practice.model';
import { MindfulnessPracticeService } from '../service/mindfulness-practice.service';

@Injectable({ providedIn: 'root' })
export class MindfulnessPracticeRoutingResolveService implements Resolve<IMindfulnessPractice | null> {
  constructor(protected service: MindfulnessPracticeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMindfulnessPractice | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mindfulnessPractice: HttpResponse<IMindfulnessPractice>) => {
          if (mindfulnessPractice.body) {
            return of(mindfulnessPractice.body);
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
