import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ACTION_TYPE, Volume } from '../../models';

@Injectable()
export class VolumeListItemFormService {
  private _fields: BehaviorSubject<FormlyFieldConfig[]> = new BehaviorSubject<FormlyFieldConfig[]>(
    [],
  );
  public fields$: Observable<FormlyFieldConfig[]> = this._fields.asObservable();
  private _model: BehaviorSubject<Volume> = new BehaviorSubject({});
  public model$: Observable<Volume> = this._model.asObservable();

  public buildFields(mode: ACTION_TYPE) {
    const disabled: boolean = mode === ACTION_TYPE.VIEW;
    const fields: FormlyFieldConfig[] = [
      {
        type: 'grid',
        fieldGroup: [
          {
            key: 'name',
            type: 'input-text',
            props: {
              label: 'VOLUMES.LIST.FIELDS.NAME',
              required: true,
              disabled,
              size: 12,
            },
          },
          {
            key: 'price',
            type: 'input-text',
            props: {
              label: 'VOLUMES.LIST.FIELDS.PRICE',
              disabled,
              size_lg: 6,
              size_md: 6,
              size_sm: 6,
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
