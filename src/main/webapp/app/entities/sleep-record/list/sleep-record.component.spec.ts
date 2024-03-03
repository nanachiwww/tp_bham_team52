import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SleepRecordService } from '../service/sleep-record.service';

import { SleepRecordComponent } from './sleep-record.component';

describe('SleepRecord Management Component', () => {
  let comp: SleepRecordComponent;
  let fixture: ComponentFixture<SleepRecordComponent>;
  let service: SleepRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'sleep-record', component: SleepRecordComponent }]), HttpClientTestingModule],
      declarations: [SleepRecordComponent],
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
      .overrideTemplate(SleepRecordComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SleepRecordComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SleepRecordService);

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
    expect(comp.sleepRecords?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to sleepRecordService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSleepRecordIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSleepRecordIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
