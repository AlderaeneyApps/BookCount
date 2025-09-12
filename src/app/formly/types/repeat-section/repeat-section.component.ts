import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslocoPipe } from '@jsverse/transloco';
import { FieldArrayType, FormlyField } from '@ngx-formly/core';
import { FormlyModule } from '../../formly.module';
import { addIcons } from 'ionicons';
import { add, close } from 'ionicons/icons';

@Component({
  selector: 'app-repeat-section',
  templateUrl: './repeat-section.component.html',
  styleUrls: ['./repeat-section.component.scss'],
  imports: [IonicModule, TranslocoPipe, FormlyModule, FormlyField],
})
export class RepeatSectionComponent extends FieldArrayType {
  constructor() {
    super();
    addIcons({
      close,
      add,
    });
  }
}
