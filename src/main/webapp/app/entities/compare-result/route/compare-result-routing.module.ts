import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CompareResultComponent } from '../list/compare-result.component';
import { CompareResultDetailComponent } from '../detail/compare-result-detail.component';
import { CompareResultUpdateComponent } from '../update/compare-result-update.component';
import { CompareResultRoutingResolveService } from './compare-result-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const compareResultRoute: Routes = [
  {
    path: '',
    component: CompareResultComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CompareResultDetailComponent,
    resolve: {
      compareResult: CompareResultRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CompareResultUpdateComponent,
    resolve: {
      compareResult: CompareResultRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CompareResultUpdateComponent,
    resolve: {
      compareResult: CompareResultRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(compareResultRoute)],
  exports: [RouterModule],
})
export class CompareResultRoutingModule {}
