import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Collection } from '../../../models';
import { SeriesStorageService } from '../../../sql-services/series-storage/series-storage.service';
import { DBSQLiteValues } from '@capacitor-community/sqlite';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
} from '@ionic/angular/standalone';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { DB_BOOK_COUNTER } from '../../../constants';
import { CollectionStorageService } from '../../../sql-services/collection-storage/collection-storage.service';
import { addIcons } from 'ionicons';
import { trashSharp } from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-collection-list-item',
  templateUrl: './collection-list-item.component.html',
  styleUrls: ['./collection-list-item.component.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    TranslocoPipe,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    RouterLink,
  ],
})
export class CollectionListItemComponent implements OnInit {
  @Input() collection!: Collection;
  public amountOfRelatedSeries!: number;

  constructor(
    private collectionStorageService: CollectionStorageService,
    private seriesStorageService: SeriesStorageService,
    private alertController: AlertController,
    private translocoService: TranslocoService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
  ) {
    addIcons({
      trashSharp,
    });
  }

  async ngOnInit() {
    try {
      await this.collectionStorageService.initializeDatabase(DB_BOOK_COUNTER);
      await this.seriesStorageService.initializeDatabase(DB_BOOK_COUNTER);
      const values: DBSQLiteValues =
        await this.seriesStorageService.countSeriesRelatedToCollection(
          this.collection.id!,
        );
      const { values: count } = values;
      this.amountOfRelatedSeries = count?.[0] || 0;
    } catch (e) {
      this.amountOfRelatedSeries = 0;
    }
  }

  public async deleteCollection() {
    const alert = await this.alertController.create({
      header: this.translocoService.translate('GLOBAL.SURE_DELETE'),
      message: this.translocoService.translate(
        'COLLECTIONS.LIST.DELETE_COLLECTION',
      ),
      buttons: [
        {
          handler: async () => {
            await this.collectionStorageService.deleteCollectionById(
              this.collection.id!,
            );
            await alert.dismiss();
          },
          text: this.translocoService.translate('GLOBAL.DELETE'),
        },
        {
          text: this.translocoService.translate('GLOBAL.CANCEL'),
          handler: async () => {
            await alert.dismiss();
          },
        },
      ],
    });

    await alert.present();
  }
}
