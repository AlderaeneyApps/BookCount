import { Component, Input, OnInit } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { FormGroup } from "@angular/forms";
import { TranslocoPipe } from "@jsverse/transloco";

@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.scss'],
  imports: [IonicModule, TranslocoPipe],
})
export class SubmitButtonComponent {
  @Input() form!: FormGroup;
}
