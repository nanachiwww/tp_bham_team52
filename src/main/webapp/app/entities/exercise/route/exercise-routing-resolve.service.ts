import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExercise } from '../exercise.model';
import { ExerciseService } from '../service/exercise.service';

@Injectable({ providedIn: 'root' })
export class ExerciseRoutingResolveService implements Resolve<IExercise | null> {
  constructor(protected service: ExerciseService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExercise | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((exercise: HttpResponse<IExercise>) => {
          if (exercise.body) {
            return of(exercise.body);
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
