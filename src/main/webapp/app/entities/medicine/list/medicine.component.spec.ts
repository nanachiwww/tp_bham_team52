import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MedicineService } from '../service/medicine.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import { MedicineComponent } from './medicine.component';

import { NextButtonComponent } from 'app/layouts/next-button/next-button.component';
describe('Medicine Management Component', () => {
  let comp: MedicineComponent;
  let fixture: ComponentFixture<MedicineComponent>;
  let service: MedicineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'medicine', component: MedicineComponent }]),
        HttpClientTestingModule,
        NextButtonComponent,
      ],
      declarations: [MedicineComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
      .overrideTemplate(MedicineComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MedicineComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MedicineService);

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
    expect(comp.medicines?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to medicineService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMedicineIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMedicineIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
