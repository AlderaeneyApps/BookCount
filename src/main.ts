import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  provideRouter,
  RouteReuseStrategy,
  withPreloading,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import {
  enableProdMode,
  importProvidersFrom,
  inject,
  isDevMode,
  provideAppInitializer,
} from '@angular/core';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { InitializeAppService } from './app/sql-services/initialize.app.service';
import { environment } from './environments/environment';
import { Capacitor } from '@capacitor/core';
import { provideServiceWorker } from '@angular/service-worker';
import { defineCustomElements as pwaElements } from '@ionic/pwa-elements/loader';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
import { SQLiteService } from './app/sql-services/sqlite.service';
import { CollectionStorageService } from './app/sql-services/collection-storage/collection-storage.service';
import { SeriesStorageService } from './app/sql-services/series-storage/series-storage.service';
import { DbnameVersionService } from './app/sql-services/dbname-version.service';
import { IonicModule } from '@ionic/angular';
import { VolumesStorageService } from './app/sql-services/volumes-storage/volumes-storage.service';
import { PicturesStorageService } from "./app/sql-services/pictures-storage/pictures-storage.service";

if (environment.production) {
  enableProdMode();
}
// --> Below only required if you want to use a web platform
const platform = Capacitor.getPlatform();
if (platform === 'web') {
  // Web platform
  // required for toast component in Browser
  pwaElements(window);

  // required for jeep-sqlite Stencil component
  // to use a SQLite database in Browser
  jeepSqlite(window);

  window.addEventListener('DOMContentLoaded', async () => {
    const jeepEl = document.createElement('jeep-sqlite');
    document.body.appendChild(jeepEl);
    await customElements.whenDefined('jeep-sqlite');
    jeepEl.autoSave = true;
  });
}

bootstrapApplication(AppComponent, {
  providers: [
    SQLiteService,
    InitializeAppService,
    DbnameVersionService,
    CollectionStorageService,
    SeriesStorageService,
    VolumesStorageService,
    PicturesStorageService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'es', 'ca'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    importProvidersFrom(IonicModule.forRoot({})),
    provideAppInitializer(() => {
      const init = inject(InitializeAppService);
      return init.initializeApp();
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
});
