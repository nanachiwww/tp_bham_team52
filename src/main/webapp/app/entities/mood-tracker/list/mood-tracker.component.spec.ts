import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MoodTrackerService } from '../service/mood-tracker.service';

import { MoodTrackerComponent } from './mood-tracker.component';

describe('MoodTracker Management Component', () => {
  let comp: MoodTrackerComponent;
  let fixture: ComponentFixture<MoodTrackerComponent>;
  let service: MoodTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'mood-tracker', component: MoodTrackerComponent }]), HttpClientTestingModule],
      declarations: [MoodTrackerComponent],
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
      .overrideTemplate(MoodTrackerComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MoodTrackerComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MoodTrackerService);

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
    expect(comp.moodTrackers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to moodTrackerService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMoodTrackerIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMoodTrackerIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
