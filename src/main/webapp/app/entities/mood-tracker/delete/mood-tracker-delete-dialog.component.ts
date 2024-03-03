import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMoodTracker } from '../mood-tracker.model';
import { MoodTrackerService } from '../service/mood-tracker.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './mood-tracker-delete-dialog.component.html',
})
export class MoodTrackerDeleteDialogComponent {
  moodTracker?: IMoodTracker;

  constructor(protected moodTrackerService: MoodTrackerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.moodTrackerService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
