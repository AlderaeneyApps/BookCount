import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EnvironmentInjector,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonRouterLink,
  IonRouterOutlet,
  IonSplitPane,
} from '@ionic/angular/standalone';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CollectionStorageService } from './sql-services/collection-storage/collection-storage.service';
import { DbnameVersionService } from './sql-services/dbname-version.service';
import { Collection } from './models/collection.model';
import { startWith, Subject, takeUntil, tap } from 'rxjs';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { addIcons } from 'ionicons';
import { addOutline, addSharp, bookSharp } from 'ionicons/icons';
import { SideMenuItem } from './models';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    IonApp,
    IonSplitPane,
    IonRouterOutlet,
    IonContent,
    IonIcon,
    IonMenu,
    RouterLink,
    RouterLinkActive,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterLink,
    TranslocoPipe,
  ],
  providers: [CollectionStorageService, DbnameVersionService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent implements OnInit, OnDestroy {
  public environmentInjector = inject(EnvironmentInjector);
  public appPages: SideMenuItem[] = [];
  public collections: Collection[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private collectionStorage: CollectionStorageService,
    private translocoService: TranslocoService,
  ) {
    addIcons({
      addSharp,
      addOutline,
      bookSharp,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.collectionStorage
      .fetchCollections()
      .pipe(
        takeUntil(this.destroy$),
        tap((collections) => {
          this.collections = collections;
        }),
      )
      .subscribe();
    this.translocoService.langChanges$
      .pipe(
        takeUntil(this.destroy$),
        startWith(this.translocoService.getActiveLang()),
      )
      .subscribe(() => {
        this.setAppMenus();
      });
    this.setAppLanguage();
  }

  private setAppMenus(): void {
    this.appPages = [
      {
        title: 'MENUS.ADD_NEW_COLLECTION',
        url: '/collections/create',
        icon: 'add',
      },
    ];
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
