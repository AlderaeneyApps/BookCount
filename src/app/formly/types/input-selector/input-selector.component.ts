import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FieldType, FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { FormColumnProps } from '../../models';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { AsyncPipe } from '@angular/common';

export interface SelectorProps extends FormlyFieldProps, FormColumnProps {}

@Component({
  selector: 'app-input-text',
  templateUrl: './input-selector.component.html',
  styleUrls: ['./input-selector.component.scss'],
  imports: [IonicModule, ReactiveFormsModule, TranslocoPipe, AsyncPipe],
})
export class InputSelectorComponent extends FieldType<FieldTypeConfig<SelectorProps>> {
  protected readonly Array = Array;
}
