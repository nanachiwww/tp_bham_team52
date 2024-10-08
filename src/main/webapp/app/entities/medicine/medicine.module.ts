import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MedicineComponent } from './list/medicine.component';
import { MedicineDetailComponent } from './detail/medicine-detail.component';
import { MedicineUpdateComponent } from './update/medicine-update.component';
import { MedicineDeleteDialogComponent } from './delete/medicine-delete-dialog.component';
import { MedicineRoutingModule } from './route/medicine-routing.module';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

library.add(faTrash);

@NgModule({
  imports: [SharedModule, MedicineRoutingModule],
  declarations: [MedicineComponent, MedicineDetailComponent, MedicineUpdateComponent, MedicineDeleteDialogComponent],
})
export class MedicineModule {}
