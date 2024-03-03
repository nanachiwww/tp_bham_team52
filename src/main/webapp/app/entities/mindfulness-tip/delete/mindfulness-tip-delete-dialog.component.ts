import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMindfulnessTip } from '../mindfulness-tip.model';
import { MindfulnessTipService } from '../service/mindfulness-tip.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './mindfulness-tip-delete-dialog.component.html',
})
export class MindfulnessTipDeleteDialogComponent {
  mindfulnessTip?: IMindfulnessTip;

  constructor(protected mindfulnessTipService: MindfulnessTipService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mindfulnessTipService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
