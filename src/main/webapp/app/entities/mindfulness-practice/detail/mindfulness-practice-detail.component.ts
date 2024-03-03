import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMindfulnessPractice } from '../mindfulness-practice.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-mindfulness-practice-detail',
  templateUrl: './mindfulness-practice-detail.component.html',
})
export class MindfulnessPracticeDetailComponent implements OnInit {
  mindfulnessPractice: IMindfulnessPractice | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mindfulnessPractice }) => {
      this.mindfulnessPractice = mindfulnessPractice;
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
