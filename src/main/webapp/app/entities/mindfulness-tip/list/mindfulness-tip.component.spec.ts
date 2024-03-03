import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MindfulnessTipService } from '../service/mindfulness-tip.service';

import { MindfulnessTipComponent } from './mindfulness-tip.component';

describe('MindfulnessTip Management Component', () => {
  let comp: MindfulnessTipComponent;
  let fixture: ComponentFixture<MindfulnessTipComponent>;
  let service: MindfulnessTipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'mindfulness-tip', component: MindfulnessTipComponent }]), HttpClientTestingModule],
      declarations: [MindfulnessTipComponent],
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
      .overrideTemplate(MindfulnessTipComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MindfulnessTipComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MindfulnessTipService);

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
    expect(comp.mindfulnessTips?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to mindfulnessTipService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMindfulnessTipIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMindfulnessTipIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
