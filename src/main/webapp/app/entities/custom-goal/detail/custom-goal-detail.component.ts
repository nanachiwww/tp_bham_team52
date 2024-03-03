import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICustomGoal } from '../custom-goal.model';

@Component({
  selector: 'jhi-custom-goal-detail',
  templateUrl: './custom-goal-detail.component.html',
})
export class CustomGoalDetailComponent implements OnInit {
  customGoal: ICustomGoal | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customGoal }) => {
      this.customGoal = customGoal;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
