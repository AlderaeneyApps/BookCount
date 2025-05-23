import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-form-grid',
  templateUrl: './form-grid.component.html',
  styleUrls: ['./form-grid.component.scss'],
  imports: [IonicModule],
})
export class FormGridComponent extends FieldWrapper {}
