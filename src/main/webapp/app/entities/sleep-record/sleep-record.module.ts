import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SleepRecordComponent } from './list/sleep-record.component';
import { SleepRecordDetailComponent } from './detail/sleep-record-detail.component';
import { SleepRecordUpdateComponent } from './update/sleep-record-update.component';
import { SleepRecordDeleteDialogComponent } from './delete/sleep-record-delete-dialog.component';
import { SleepRecordRoutingModule } from './route/sleep-record-routing.module';

@NgModule({
  imports: [SharedModule, SleepRecordRoutingModule],
  declarations: [SleepRecordComponent, SleepRecordDetailComponent, SleepRecordUpdateComponent, SleepRecordDeleteDialogComponent],
})
export class SleepRecordModule {}
