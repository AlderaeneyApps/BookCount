import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  imports: [IonicModule, TranslocoPipe],
})
export class InputTextComponent extends FieldType<FieldTypeConfig> {}
