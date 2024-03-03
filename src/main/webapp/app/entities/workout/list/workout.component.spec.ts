import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { WorkoutService } from '../service/workout.service';

import { WorkoutComponent } from './workout.component';

describe('Workout Management Component', () => {
  let comp: WorkoutComponent;
  let fixture: ComponentFixture<WorkoutComponent>;
  let service: WorkoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'workout', component: WorkoutComponent }]), HttpClientTestingModule],
      declarations: [WorkoutComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(WorkoutComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WorkoutComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(WorkoutService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.workouts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to workoutService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getWorkoutIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getWorkoutIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
