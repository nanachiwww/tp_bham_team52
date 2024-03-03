import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CompareResultFormService } from './compare-result-form.service';
import { CompareResultService } from '../service/compare-result.service';
import { ICompareResult } from '../compare-result.model';

import { CompareResultUpdateComponent } from './compare-result-update.component';

describe('CompareResult Management Update Component', () => {
  let comp: CompareResultUpdateComponent;
  let fixture: ComponentFixture<CompareResultUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let compareResultFormService: CompareResultFormService;
  let compareResultService: CompareResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CompareResultUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CompareResultUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompareResultUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    compareResultFormService = TestBed.inject(CompareResultFormService);
    compareResultService = TestBed.inject(CompareResultService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const compareResult: ICompareResult = { id: 456 };

      activatedRoute.data = of({ compareResult });
      comp.ngOnInit();

      expect(comp.compareResult).toEqual(compareResult);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompareResult>>();
      const compareResult = { id: 123 };
      jest.spyOn(compareResultFormService, 'getCompareResult').mockReturnValue(compareResult);
      jest.spyOn(compareResultService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compareResult });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: compareResult }));
      saveSubject.complete();

      // THEN
      expect(compareResultFormService.getCompareResult).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(compareResultService.update).toHaveBeenCalledWith(expect.objectContaining(compareResult));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompareResult>>();
      const compareResult = { id: 123 };
      jest.spyOn(compareResultFormService, 'getCompareResult').mockReturnValue({ id: null });
      jest.spyOn(compareResultService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compareResult: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: compareResult }));
      saveSubject.complete();

      // THEN
      expect(compareResultFormService.getCompareResult).toHaveBeenCalled();
      expect(compareResultService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICompareResult>>();
      const compareResult = { id: 123 };
      jest.spyOn(compareResultService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ compareResult });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(compareResultService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
