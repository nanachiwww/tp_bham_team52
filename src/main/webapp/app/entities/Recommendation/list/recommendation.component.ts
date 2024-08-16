import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['recommendation.component.scss'],
})
export class RecommendationComponent implements OnInit {
  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {}
}
