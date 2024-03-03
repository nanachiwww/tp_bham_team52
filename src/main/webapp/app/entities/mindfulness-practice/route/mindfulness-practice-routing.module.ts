import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MindfulnessPracticeComponent } from '../list/mindfulness-practice.component';
import { MindfulnessPracticeDetailComponent } from '../detail/mindfulness-practice-detail.component';
import { MindfulnessPracticeUpdateComponent } from '../update/mindfulness-practice-update.component';
import { MindfulnessPracticeRoutingResolveService } from './mindfulness-practice-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const mindfulnessPracticeRoute: Routes = [
  {
    path: '',
    component: MindfulnessPracticeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MindfulnessPracticeDetailComponent,
    resolve: {
      mindfulnessPractice: MindfulnessPracticeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MindfulnessPracticeUpdateComponent,
    resolve: {
      mindfulnessPractice: MindfulnessPracticeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MindfulnessPracticeUpdateComponent,
    resolve: {
      mindfulnessPractice: MindfulnessPracticeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mindfulnessPracticeRoute)],
  exports: [RouterModule],
})
export class MindfulnessPracticeRoutingModule {}
