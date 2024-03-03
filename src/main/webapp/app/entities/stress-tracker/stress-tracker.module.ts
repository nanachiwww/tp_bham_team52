import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StressTrackerComponent } from './list/stress-tracker.component';
import { StressTrackerDetailComponent } from './detail/stress-tracker-detail.component';
import { StressTrackerUpdateComponent } from './update/stress-tracker-update.component';
import { StressTrackerDeleteDialogComponent } from './delete/stress-tracker-delete-dialog.component';
import { StressTrackerRoutingModule } from './route/stress-tracker-routing.module';

@NgModule({
  imports: [SharedModule, StressTrackerRoutingModule],
  declarations: [StressTrackerComponent, StressTrackerDetailComponent, StressTrackerUpdateComponent, StressTrackerDeleteDialogComponent],
})
export class StressTrackerModule {}
