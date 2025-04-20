import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { add, remove } from 'ionicons/icons';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-number-button.component.html',
  styleUrls: ['./input-number-button.component.scss'],
  imports: [IonicModule, TranslocoPipe],
})
export class InputNumberButtonComponent extends FieldType<FieldTypeConfig> {
  constructor() {
    super();

    addIcons({
      add,
      remove,
    });
  }
}
