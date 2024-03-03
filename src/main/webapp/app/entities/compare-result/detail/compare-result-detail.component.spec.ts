import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CompareResultDetailComponent } from './compare-result-detail.component';

describe('CompareResult Management Detail Component', () => {
  let comp: CompareResultDetailComponent;
  let fixture: ComponentFixture<CompareResultDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompareResultDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ compareResult: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CompareResultDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CompareResultDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load compareResult on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.compareResult).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
