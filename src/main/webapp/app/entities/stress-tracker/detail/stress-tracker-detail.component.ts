import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStressTracker } from '../stress-tracker.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-stress-tracker-detail',
  templateUrl: './stress-tracker-detail.component.html',
})
export class StressTrackerDetailComponent implements OnInit {
  stressTracker: IStressTracker | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stressTracker }) => {
      this.stressTracker = stressTracker;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
