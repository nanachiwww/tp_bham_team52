import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MindfulnessTipComponent } from '../list/mindfulness-tip.component';
import { MindfulnessTipDetailComponent } from '../detail/mindfulness-tip-detail.component';
import { MindfulnessTipUpdateComponent } from '../update/mindfulness-tip-update.component';
import { MindfulnessTipRoutingResolveService } from './mindfulness-tip-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const mindfulnessTipRoute: Routes = [
  {
    path: '',
    component: MindfulnessTipComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MindfulnessTipDetailComponent,
    resolve: {
      mindfulnessTip: MindfulnessTipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MindfulnessTipUpdateComponent,
    resolve: {
      mindfulnessTip: MindfulnessTipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MindfulnessTipUpdateComponent,
    resolve: {
      mindfulnessTip: MindfulnessTipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mindfulnessTipRoute)],
  exports: [RouterModule],
})
export class MindfulnessTipRoutingModule {}
