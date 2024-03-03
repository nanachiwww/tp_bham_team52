import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CustomGoalComponent } from '../list/custom-goal.component';
import { CustomGoalDetailComponent } from '../detail/custom-goal-detail.component';
import { CustomGoalUpdateComponent } from '../update/custom-goal-update.component';
import { CustomGoalRoutingResolveService } from './custom-goal-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const customGoalRoute: Routes = [
  {
    path: '',
    component: CustomGoalComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CustomGoalDetailComponent,
    resolve: {
      customGoal: CustomGoalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CustomGoalUpdateComponent,
    resolve: {
      customGoal: CustomGoalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CustomGoalUpdateComponent,
    resolve: {
      customGoal: CustomGoalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(customGoalRoute)],
  exports: [RouterModule],
})
export class CustomGoalRoutingModule {}
