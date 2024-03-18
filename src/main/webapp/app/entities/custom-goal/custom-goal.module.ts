import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CustomGoalComponent } from './list/custom-goal.component';
import { CustomGoalDetailComponent } from './detail/custom-goal-detail.component';
import { CustomGoalUpdateComponent } from './update/custom-goal-update.component';
import { CustomGoalDeleteDialogComponent } from './delete/custom-goal-delete-dialog.component';
import { CustomGoalRoutingModule } from './route/custom-goal-routing.module';
import { EnergyIntakeResultModule } from '../energy-intake-result/energy-intake-result.module';

@NgModule({
  imports: [SharedModule, CustomGoalRoutingModule, EnergyIntakeResultModule],
  declarations: [CustomGoalComponent, CustomGoalDetailComponent, CustomGoalUpdateComponent, CustomGoalDeleteDialogComponent],
})
export class CustomGoalModule {}
