import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IStressTracker } from '../stress-tracker.model';
import { StressTrackerService } from '../service/stress-tracker.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './stress-tracker-delete-dialog.component.html',
})
export class StressTrackerDeleteDialogComponent {
  stressTracker?: IStressTracker;

  constructor(protected stressTrackerService: StressTrackerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.stressTrackerService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
