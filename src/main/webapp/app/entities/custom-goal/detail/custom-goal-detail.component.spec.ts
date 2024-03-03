import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CustomGoalDetailComponent } from './custom-goal-detail.component';

describe('CustomGoal Management Detail Component', () => {
  let comp: CustomGoalDetailComponent;
  let fixture: ComponentFixture<CustomGoalDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomGoalDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ customGoal: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CustomGoalDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CustomGoalDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load customGoal on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.customGoal).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
