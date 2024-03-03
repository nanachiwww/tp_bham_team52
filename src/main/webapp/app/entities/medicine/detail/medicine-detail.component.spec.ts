import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MedicineDetailComponent } from './medicine-detail.component';

describe('Medicine Management Detail Component', () => {
  let comp: MedicineDetailComponent;
  let fixture: ComponentFixture<MedicineDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicineDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ medicine: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MedicineDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MedicineDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load medicine on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.medicine).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
