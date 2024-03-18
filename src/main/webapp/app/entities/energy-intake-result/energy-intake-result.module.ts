import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EnergyIntakeResultComponent } from './list/energy-intake-result.component';
import { EnergyIntakeResultDetailComponent } from './detail/energy-intake-result-detail.component';
import { EnergyIntakeResultUpdateComponent } from './update/energy-intake-result-update.component';
import { EnergyIntakeResultDeleteDialogComponent } from './delete/energy-intake-result-delete-dialog.component';
import { EnergyIntakeResultRoutingModule } from './route/energy-intake-result-routing.module';

@NgModule({
  imports: [SharedModule, EnergyIntakeResultRoutingModule],
  declarations: [
    EnergyIntakeResultComponent,
    EnergyIntakeResultDetailComponent,
    EnergyIntakeResultUpdateComponent,
    EnergyIntakeResultDeleteDialogComponent,
  ],
  exports: [EnergyIntakeResultComponent],
})
export class EnergyIntakeResultModule {}
