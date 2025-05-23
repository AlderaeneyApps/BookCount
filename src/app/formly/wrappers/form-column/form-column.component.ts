import { Component } from '@angular/core';
import { FieldTypeConfig, FieldWrapper } from '@ngx-formly/core';
import { IonicModule } from '@ionic/angular';

export interface FormColumnProps {
  size?: number;
  size_xs?: number;
  size_sm?: number;
  size_md?: number;
  size_lg?: number;
  size_xl?: number;
}

@Component({
  selector: 'app-form-column',
  templateUrl: './form-column.component.html',
  styleUrls: ['./form-column.component.scss'],
  imports: [IonicModule],
})
export class FormColumnComponent extends FieldWrapper<FieldTypeConfig<FormColumnProps>> {}
