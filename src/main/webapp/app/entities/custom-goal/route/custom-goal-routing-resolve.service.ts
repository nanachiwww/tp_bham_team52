import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICustomGoal } from '../custom-goal.model';
import { CustomGoalService } from '../service/custom-goal.service';

@Injectable({ providedIn: 'root' })
export class CustomGoalRoutingResolveService implements Resolve<ICustomGoal | null> {
  constructor(protected service: CustomGoalService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICustomGoal | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((customGoal: HttpResponse<ICustomGoal>) => {
          if (customGoal.body) {
            return of(customGoal.body);
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
