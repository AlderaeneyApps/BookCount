import { Component, Input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  imports: [TranslocoPipe, IonicModule, RouterLink],
})
export class PageComponent {
  @Input() title!: string;
  @Input() showBackButton: boolean = false;
  @Input() backRoute!: any[];

  constructor() {
    addIcons({
      arrowBack,
    });
  }
}
