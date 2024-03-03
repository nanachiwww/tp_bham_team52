import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SleepRecordDetailComponent } from './sleep-record-detail.component';

describe('SleepRecord Management Detail Component', () => {
  let comp: SleepRecordDetailComponent;
  let fixture: ComponentFixture<SleepRecordDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SleepRecordDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ sleepRecord: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SleepRecordDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SleepRecordDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load sleepRecord on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.sleepRecord).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
