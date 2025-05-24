import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyComponent } from './components';
import { FormlyModule as RealFormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyIonicModule } from '@ngx-formly/ionic';
import { IonicModule } from '@ionic/angular';
import {
  InputNumberButtonComponent,
  InputNumberComponent,
  InputTextareaComponent,
  InputTextComponent,
  PicturePickerComponent,
} from './types';
import { FormGridComponent } from './types/form-grid/form-grid.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormlyComponent,
    RealFormlyModule.forRoot({
      types: [
        {
          name: 'input-text',
          component: InputTextComponent,
        },
        {
          name: 'input-textarea',
          component: InputTextareaComponent,
        },
        {
          name: 'input-number',
          component: InputNumberComponent,
        },
        {
          name: 'input-number-button',
          component: InputNumberButtonComponent,
        },
        {
          name: 'picture-picker',
          component: PicturePickerComponent,
        },
        {
          name: 'grid',
          component: FormGridComponent,
        },
      ],
    }),
    ReactiveFormsModule,
    FormlyIonicModule,
    IonicModule,
  ],
  exports: [FormlyComponent],
})
export class FormlyModule {}
