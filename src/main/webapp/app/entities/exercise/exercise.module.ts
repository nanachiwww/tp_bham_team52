import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ExerciseComponent } from './list/exercise.component';
import { ExerciseDetailComponent } from './detail/exercise-detail.component';
import { ExerciseUpdateComponent } from './update/exercise-update.component';
import { ExerciseDeleteDialogComponent } from './delete/exercise-delete-dialog.component';
import { ExerciseRoutingModule } from './route/exercise-routing.module';

@NgModule({
  imports: [SharedModule, ExerciseRoutingModule],
  declarations: [ExerciseComponent, ExerciseDetailComponent, ExerciseUpdateComponent, ExerciseDeleteDialogComponent],
})
export class ExerciseModule {}
