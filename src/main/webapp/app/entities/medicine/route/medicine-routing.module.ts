import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MedicineComponent } from '../list/medicine.component';
import { MedicineDetailComponent } from '../detail/medicine-detail.component';
import { MedicineUpdateComponent } from '../update/medicine-update.component';
import { MedicineRoutingResolveService } from './medicine-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const medicineRoute: Routes = [
  {
    path: '',
    component: MedicineComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MedicineDetailComponent,
    resolve: {
      medicine: MedicineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MedicineUpdateComponent,
    resolve: {
      medicine: MedicineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MedicineUpdateComponent,
    resolve: {
      medicine: MedicineRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(medicineRoute)],
  exports: [RouterModule],
})
export class MedicineRoutingModule {}
