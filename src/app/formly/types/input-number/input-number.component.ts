import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FieldType, FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormColumnProps } from '../../models';
import { ReactiveFormsModule } from '@angular/forms';

export interface NumberProps extends FormlyFieldProps, FormColumnProps {}

@Component({
  selector: 'app-input-text',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
  imports: [IonicModule, TranslocoPipe, ReactiveFormsModule],
})
export class InputNumberComponent extends FieldType<FieldTypeConfig<NumberProps>> {
  constructor() {
    super();
  }
}
