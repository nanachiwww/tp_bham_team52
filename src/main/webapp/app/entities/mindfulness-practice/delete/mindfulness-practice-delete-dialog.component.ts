import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMindfulnessPractice } from '../mindfulness-practice.model';
import { MindfulnessPracticeService } from '../service/mindfulness-practice.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './mindfulness-practice-delete-dialog.component.html',
})
export class MindfulnessPracticeDeleteDialogComponent {
  mindfulnessPractice?: IMindfulnessPractice;

  constructor(protected mindfulnessPracticeService: MindfulnessPracticeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mindfulnessPracticeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
