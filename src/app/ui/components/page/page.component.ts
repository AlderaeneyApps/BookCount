import { Component, Input } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  imports: [
    IonBackButton,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonContent,
    TranslocoPipe,
    IonMenuButton,
  ],
})
export class PageComponent {
  @Input() title!: string;
}
