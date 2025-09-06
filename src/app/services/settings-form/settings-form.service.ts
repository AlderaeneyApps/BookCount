import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Settings } from '../../models';
import { getLangOptions } from '../../functions';

@Injectable()
export class SettingsFormService {
  private _fields: BehaviorSubject<FormlyFieldConfig[]> = new BehaviorSubject<FormlyFieldConfig[]>(
    [],
  );
  public fields$: Observable<FormlyFieldConfig[]> = this._fields.asObservable();
  private _model: BehaviorSubject<Settings> = new BehaviorSubject({});
  public model$: Observable<Settings> = this._model.asObservable();

  public buildFields() {
    const fields: FormlyFieldConfig[] = [
      {
        type: 'grid',
        fieldGroup: [
          {
            key: 'lang',
            type: 'input-selector',
            props: {
              label: 'SETTINGS.FORM.LANG',
              required: true,
              size: 12,
              options: getLangOptions(),
            },
          },
        ],
      },
    ];

    this._fields.next(fields);
  }

  public setModel(model: Settings) {
    if (!model) return;

    this._model.next(model);
  }
}
