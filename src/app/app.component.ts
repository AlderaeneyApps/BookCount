import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit {
  constructor(private translocoService: TranslocoService) {}

  async ngOnInit() {
    this.setAppLanguage();
  }

  private setAppLanguage() {
    const userLang = navigator.language;
    let primaryLang: string;
    if (userLang.includes('_')) {
      primaryLang = userLang.split('_')[0];
    } else if (userLang.includes('-')) {
      primaryLang = userLang.split('-')[0];
    } else {
      primaryLang = userLang;
    }
    const languages = this.translocoService.getAvailableLangs();
    let languageToSet: string;
    if ((languages as string[]).includes(primaryLang)) {
      languageToSet = primaryLang;
    } else {
      languageToSet = 'en';
    }
    this.translocoService.setActiveLang(languageToSet);
  }
}
