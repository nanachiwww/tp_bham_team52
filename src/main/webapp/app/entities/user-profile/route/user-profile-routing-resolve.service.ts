import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserProfile } from '../user-profile.model';
import { UserProfileService } from '../service/user-profile.service';

@Injectable({ providedIn: 'root' })
export class UserProfileRoutingResolveService implements Resolve<IUserProfile | null> {
  constructor(protected service: UserProfileService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserProfile | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userProfile: HttpResponse<IUserProfile>) => {
          if (userProfile.body) {
            return of(userProfile.body);
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
