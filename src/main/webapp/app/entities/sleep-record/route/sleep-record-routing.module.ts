import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SleepRecordComponent } from '../list/sleep-record.component';
import { SleepRecordDetailComponent } from '../detail/sleep-record-detail.component';
import { SleepRecordUpdateComponent } from '../update/sleep-record-update.component';
import { SleepRecordRoutingResolveService } from './sleep-record-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const sleepRecordRoute: Routes = [
  {
    path: '',
    component: SleepRecordComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SleepRecordDetailComponent,
    resolve: {
      sleepRecord: SleepRecordRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SleepRecordUpdateComponent,
    resolve: {
      sleepRecord: SleepRecordRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SleepRecordUpdateComponent,
    resolve: {
      sleepRecord: SleepRecordRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sleepRecordRoute)],
  exports: [RouterModule],
})
export class SleepRecordRoutingModule {}
