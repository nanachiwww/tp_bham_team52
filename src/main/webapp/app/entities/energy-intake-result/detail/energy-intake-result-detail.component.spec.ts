import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EnergyIntakeResultDetailComponent } from './energy-intake-result-detail.component';

describe('EnergyIntakeResult Management Detail Component', () => {
  let comp: EnergyIntakeResultDetailComponent;
  let fixture: ComponentFixture<EnergyIntakeResultDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnergyIntakeResultDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ energyIntakeResult: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EnergyIntakeResultDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EnergyIntakeResultDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load energyIntakeResult on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.energyIntakeResult).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
