import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyField } from '@ngx-formly/core';
import { IonicModule } from '@ionic/angular';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-form-grid',
  templateUrl: './form-grid.component.html',
  styleUrls: ['./form-grid.component.scss'],
  imports: [IonicModule, FormlyField, JsonPipe],
})
export class FormGridComponent extends FieldType<FieldTypeConfig> {}
