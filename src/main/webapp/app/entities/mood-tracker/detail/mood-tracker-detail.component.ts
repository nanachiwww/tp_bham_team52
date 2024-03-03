import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMoodTracker } from '../mood-tracker.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-mood-tracker-detail',
  templateUrl: './mood-tracker-detail.component.html',
})
export class MoodTrackerDetailComponent implements OnInit {
  moodTracker: IMoodTracker | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ moodTracker }) => {
      this.moodTracker = moodTracker;
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
