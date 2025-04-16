import { Component, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { FieldType, FieldTypeConfig } from "@ngx-formly/core";
import { TranslocoPipe } from "@jsverse/transloco";

@Component({
  selector: 'app-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss'],
  imports: [IonicModule, TranslocoPipe],
})
export class InputTextComponent extends FieldType<FieldTypeConfig> {
  constructor() {
    super();
  }
}
