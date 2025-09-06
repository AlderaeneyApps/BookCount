import { Component, Input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBack, cog } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { SettingsPageComponent } from '../../../pages/settings/settings-page/settings-page.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  imports: [TranslocoPipe, IonicModule, RouterLink, ModalComponent, SettingsPageComponent],
})
export class PageComponent {
  @Input() title!: string;
  @Input() showBackButton: boolean = false;
  @Input() backRoute!: any[];

  public showModal: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {
    addIcons({
      arrowBack,
      cog,
    });
  }
}
