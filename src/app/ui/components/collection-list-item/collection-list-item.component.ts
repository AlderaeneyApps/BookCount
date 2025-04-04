import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Collection } from '../../../models';
import { SeriesStorageService } from '../../../sql-services/series-storage/series-storage.service';
import { DBSQLiteValues } from '@capacitor-community/sqlite';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { CollectionStorageService } from '../../../sql-services/collection-storage/collection-storage.service';
import { addIcons } from 'ionicons';
import { trashSharp } from 'ionicons/icons';
import { Router, RouterLink } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-collection-list-item',
  templateUrl: './collection-list-item.component.html',
  styleUrls: ['./collection-list-item.component.scss'],
  imports: [IonicModule, TranslocoPipe, RouterLink],
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
      const values: DBSQLiteValues =
        await this.seriesStorageService.countSeriesRelatedToCollection(
          this.collection.id!,
        );
      const { values: count } = values;
      this.amountOfRelatedSeries = count?.[0]?.['COUNT(id)'] || 0;
    } catch (e) {
      console.error(e);
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
