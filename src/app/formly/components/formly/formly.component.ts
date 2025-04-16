import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { FormlyFieldConfig, FormlyForm } from "@ngx-formly/core";

@Component({
  selector: 'app-formly',
  templateUrl: './formly.component.html',
  styleUrls: ['./formly.component.scss'],
  imports: [FormlyForm, ReactiveFormsModule],
})
export class FormlyComponent {
  @Input() form!: FormGroup;
  @Input() fields!: FormlyFieldConfig[];
  @Input() model!: any;

  @Output() submitEv: EventEmitter<any> = new EventEmitter();
}
