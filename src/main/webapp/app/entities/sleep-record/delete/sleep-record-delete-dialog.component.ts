import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISleepRecord } from '../sleep-record.model';
import { SleepRecordService } from '../service/sleep-record.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './sleep-record-delete-dialog.component.html',
})
export class SleepRecordDeleteDialogComponent {
  sleepRecord?: ISleepRecord;

  constructor(protected sleepRecordService: SleepRecordService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sleepRecordService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
