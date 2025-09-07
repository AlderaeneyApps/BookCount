import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { IonicModule } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

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
    await this.setAppLanguage();
  }

  private async setAppLanguage() {
    let userLang = navigator.language;
    const settingLang = await this.getLangSetting();
    if (settingLang.value) {
      userLang = settingLang.value;
    }
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

    if (!settingLang.value) {
      await this.setLangSetting(languageToSet);
    }
  }

  private async getLangSetting() {
    return await Preferences.get({
      key: 'lang',
    });
  }

  private async setLangSetting(lang: string) {
    await Preferences.set({
      key: 'lang',
      value: lang,
    });
  }
}
