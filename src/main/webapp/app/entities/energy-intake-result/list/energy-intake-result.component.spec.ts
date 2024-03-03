import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EnergyIntakeResultService } from '../service/energy-intake-result.service';

import { EnergyIntakeResultComponent } from './energy-intake-result.component';

describe('EnergyIntakeResult Management Component', () => {
  let comp: EnergyIntakeResultComponent;
  let fixture: ComponentFixture<EnergyIntakeResultComponent>;
  let service: EnergyIntakeResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'energy-intake-result', component: EnergyIntakeResultComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [EnergyIntakeResultComponent],
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
      .overrideTemplate(EnergyIntakeResultComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EnergyIntakeResultComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EnergyIntakeResultService);

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
    expect(comp.energyIntakeResults?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to energyIntakeResultService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getEnergyIntakeResultIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getEnergyIntakeResultIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
