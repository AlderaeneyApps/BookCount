import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FieldType, FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormColumnProps } from '../../models';
import { ReactiveFormsModule } from '@angular/forms';

export interface TextAreaProps extends FormlyFieldProps, FormColumnProps {}

@Component({
  selector: 'app-input-textarea',
  templateUrl: './input-textarea.component.html',
  styleUrls: ['./input-textarea.component.scss'],
  imports: [IonicModule, TranslocoPipe, ReactiveFormsModule],
})
export class InputTextareaComponent extends FieldType<FieldTypeConfig<TextAreaProps>> {
  constructor() {
    super();
  }
}
