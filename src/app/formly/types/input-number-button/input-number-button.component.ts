import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FieldType, FieldTypeConfig, FormlyFieldProps } from '@ngx-formly/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';
import { FormColumnProps } from '../../models';
import { ReactiveFormsModule } from '@angular/forms';

export interface NumberButtonProps extends FormlyFieldProps, FormColumnProps {}

@Component({
  selector: 'app-number-button',
  templateUrl: './input-number-button.component.html',
  styleUrls: ['./input-number-button.component.scss'],
  imports: [IonicModule, TranslocoPipe, ReactiveFormsModule],
})
export class InputNumberButtonComponent extends FieldType<FieldTypeConfig<NumberButtonProps>> {
  constructor() {
    super();

    addIcons({
      add,
      remove,
    });
  }

  public increaseNumber(): void {
    this.formControl.setValue(this.formControl.value + 1);
  }

  public decreaseNumber(): void {
    this.formControl.setValue(this.formControl.value - 1);
  }
}
