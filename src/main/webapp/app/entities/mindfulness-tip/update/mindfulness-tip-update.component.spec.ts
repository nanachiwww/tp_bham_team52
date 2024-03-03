import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MindfulnessTipFormService } from './mindfulness-tip-form.service';
import { MindfulnessTipService } from '../service/mindfulness-tip.service';
import { IMindfulnessTip } from '../mindfulness-tip.model';

import { MindfulnessTipUpdateComponent } from './mindfulness-tip-update.component';

describe('MindfulnessTip Management Update Component', () => {
  let comp: MindfulnessTipUpdateComponent;
  let fixture: ComponentFixture<MindfulnessTipUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mindfulnessTipFormService: MindfulnessTipFormService;
  let mindfulnessTipService: MindfulnessTipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MindfulnessTipUpdateComponent],
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
      .overrideTemplate(MindfulnessTipUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MindfulnessTipUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mindfulnessTipFormService = TestBed.inject(MindfulnessTipFormService);
    mindfulnessTipService = TestBed.inject(MindfulnessTipService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const mindfulnessTip: IMindfulnessTip = { id: 456 };

      activatedRoute.data = of({ mindfulnessTip });
      comp.ngOnInit();

      expect(comp.mindfulnessTip).toEqual(mindfulnessTip);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMindfulnessTip>>();
      const mindfulnessTip = { id: 123 };
      jest.spyOn(mindfulnessTipFormService, 'getMindfulnessTip').mockReturnValue(mindfulnessTip);
      jest.spyOn(mindfulnessTipService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mindfulnessTip });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mindfulnessTip }));
      saveSubject.complete();

      // THEN
      expect(mindfulnessTipFormService.getMindfulnessTip).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(mindfulnessTipService.update).toHaveBeenCalledWith(expect.objectContaining(mindfulnessTip));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMindfulnessTip>>();
      const mindfulnessTip = { id: 123 };
      jest.spyOn(mindfulnessTipFormService, 'getMindfulnessTip').mockReturnValue({ id: null });
      jest.spyOn(mindfulnessTipService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mindfulnessTip: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mindfulnessTip }));
      saveSubject.complete();

      // THEN
      expect(mindfulnessTipFormService.getMindfulnessTip).toHaveBeenCalled();
      expect(mindfulnessTipService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMindfulnessTip>>();
      const mindfulnessTip = { id: 123 };
      jest.spyOn(mindfulnessTipService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mindfulnessTip });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mindfulnessTipService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
