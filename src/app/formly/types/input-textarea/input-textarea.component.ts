import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-input-textarea',
  templateUrl: './input-textarea.component.html',
  styleUrls: ['./input-textarea.component.scss'],
  imports: [IonicModule, TranslocoPipe],
})
export class InputTextareaComponent extends FieldType<FieldTypeConfig> {
  constructor() {
    super();
  }
}
