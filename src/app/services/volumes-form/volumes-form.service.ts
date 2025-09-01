import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Volume } from '../../models';

@Injectable()
export class VolumesFormService {
  private _fields: BehaviorSubject<FormlyFieldConfig[]> = new BehaviorSubject<FormlyFieldConfig[]>(
    [],
  );
  public fields$: Observable<FormlyFieldConfig[]> = this._fields.asObservable();
  private _model: BehaviorSubject<Volume> = new BehaviorSubject({});
  public model$: Observable<Volume> = this._model.asObservable();

  public buildFields() {
    const fields: FormlyFieldConfig[] = [
      {
        type: 'grid',
        fieldGroup: [
          {
            key: 'volumeNumber',
            type: 'input-number',
            props: {
              label: 'VOLUMES.FORM.FIELDS.VOLUME_NUMBER',
              required: true,
              size: 12,
              size_md: 6,
              size_xl: 4,
            },
          },
          {
            key: 'name',
            type: 'input-text',
            props: {
              label: 'VOLUMES.FORM.FIELDS.NAME',
              required: true,
              size: 12,
              size_md: 6,
              size_xl: 4,
            },
          },
          {
            key: 'price',
            type: 'input-number',
            props: {
              label: 'VOLUMES.FORM.FIELDS.PRICE',
              size: 12,
              size_md: 6,
              size_xl: 4,
            },
          },
          {
            key: 'picture',
            type: 'picture-picker',
            props: {
              label: 'VOLUMES.FORM.FIELDS.PICTURE',
              size: 12,
            },
          },
        ],
      },
    ];

    this._fields.next(fields);
  }

  public setModel(model: Volume) {
    if (!model) return;

    this._model.next(model);
  }
}
