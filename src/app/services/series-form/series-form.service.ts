import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Series } from '../../models';

@Injectable()
export class SeriesFormService {
  private _fields: BehaviorSubject<FormlyFieldConfig[]> = new BehaviorSubject<FormlyFieldConfig[]>(
    [],
  );
  public fields$: Observable<FormlyFieldConfig[]> = this._fields.asObservable();
  private _model: BehaviorSubject<Series> = new BehaviorSubject({});
  public model$: Observable<Series> = this._model.asObservable();

  public buildFields() {
    const fields: FormlyFieldConfig[] = [
      {
        type: 'grid',
        fieldGroup: [
          {
            key: 'name',
            type: 'input-text',
            props: {
              label: 'SERIES.FORM.FIELDS.NAME',
              required: true,
              size: 12,
            },
          },
          {
            key: 'picture',
            type: 'picture-picker',
            props: {
              label: 'SERIES.FORM.FIELDS.PICTURE',
              size: 12,
            },
          },
        ],
      },
    ];

    this._fields.next(fields);
  }

  public setModel(model: Series) {
    if (!model) return;

    this._model.next(model);
  }
}
