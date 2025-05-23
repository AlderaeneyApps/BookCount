import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Collection } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class CollectionFormService {
  private _fields: BehaviorSubject<FormlyFieldConfig[]> = new BehaviorSubject<FormlyFieldConfig[]>(
    [],
  );
  public fields$: Observable<FormlyFieldConfig[]> = this._fields.asObservable();
  private _model: BehaviorSubject<Collection> = new BehaviorSubject({});
  public model$: Observable<Collection> = this._model.asObservable();

  public buildFields() {
    const fields: FormlyFieldConfig[] = [
      {
        wrappers: ['form-grid'],
        fieldGroup: [
          {
            wrappers: ['form-column'],
            props: {
              size: 12,
            },
            fieldGroup: [
              {
                key: 'name',
                type: 'input-text',
                props: {
                  label: 'COLLECTIONS.FORM.FIELDS.NAME',
                },
              },
            ],
          },
        ],
      },
    ];

    this._fields.next(fields);
  }

  public setModel(model: Collection) {
    if (!model) return;

    this._model.next(model);
  }
}
