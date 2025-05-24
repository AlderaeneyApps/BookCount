import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FieldType, FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormColumnProps } from '../../models';
import { ReactiveFormsModule } from '@angular/forms';

export interface TextProps extends FormlyFieldProps, FormColumnProps {}

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  imports: [IonicModule, TranslocoPipe, ReactiveFormsModule],
})
export class InputTextComponent extends FieldType<FieldTypeConfig<TextProps>> {}
