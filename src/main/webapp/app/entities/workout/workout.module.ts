import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { WorkoutComponent } from './list/workout.component';
import { WorkoutDetailComponent } from './detail/workout-detail.component';
import { WorkoutUpdateComponent } from './update/workout-update.component';
import { WorkoutDeleteDialogComponent } from './delete/workout-delete-dialog.component';
import { WorkoutRoutingModule } from './route/workout-routing.module';

@NgModule({
  imports: [SharedModule, WorkoutRoutingModule],
  declarations: [WorkoutComponent, WorkoutDetailComponent, WorkoutUpdateComponent, WorkoutDeleteDialogComponent],
})
export class WorkoutModule {}
