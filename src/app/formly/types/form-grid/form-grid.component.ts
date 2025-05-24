import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyField } from '@ngx-formly/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-form-grid',
  templateUrl: './form-grid.component.html',
  styleUrls: ['./form-grid.component.scss'],
  imports: [IonicModule, FormlyField],
})
export class FormGridComponent extends FieldType<FieldTypeConfig> {}
