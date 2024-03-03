import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CompareResultService } from '../service/compare-result.service';

import { CompareResultComponent } from './compare-result.component';

describe('CompareResult Management Component', () => {
  let comp: CompareResultComponent;
  let fixture: ComponentFixture<CompareResultComponent>;
  let service: CompareResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'compare-result', component: CompareResultComponent }]), HttpClientTestingModule],
      declarations: [CompareResultComponent],
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
      .overrideTemplate(CompareResultComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompareResultComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CompareResultService);

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
    expect(comp.compareResults?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to compareResultService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCompareResultIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCompareResultIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
