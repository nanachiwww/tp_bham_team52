import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISleepRecord } from '../sleep-record.model';

@Component({
  selector: 'jhi-sleep-record-detail',
  templateUrl: './sleep-record-detail.component.html',
})
export class SleepRecordDetailComponent implements OnInit {
  sleepRecord: ISleepRecord | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sleepRecord }) => {
      this.sleepRecord = sleepRecord;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
