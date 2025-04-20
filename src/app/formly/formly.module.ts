import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyComponent } from './components/formly/formly.component';
import { FormlyModule as RealFormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyIonicModule } from '@ngx-formly/ionic';
import { IonicModule } from '@ionic/angular';
import { InputTextComponent } from './types/input-text/input-text.component';
import { InputTextareaComponent } from './types/input-textarea/input-textarea.component';
import { InputNumberComponent } from './types/input-number/input-number.component';
import { InputNumberButtonComponent } from './types/input-number-button/input-number-button.component';

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
      ],
    }),
    ReactiveFormsModule,
    FormlyIonicModule,
    IonicModule,
  ],
  exports: [FormlyComponent],
})
export class FormlyModule {}
