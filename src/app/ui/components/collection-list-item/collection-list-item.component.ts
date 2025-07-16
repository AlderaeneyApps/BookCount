import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ACTION_TYPE, ActionSheetOptions, Collection } from '../../../models';
import { SeriesStorageService } from '../../../sql-services/series-storage/series-storage.service';
import { DBSQLiteValues } from '@capacitor-community/sqlite';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { CollectionStorageService } from '../../../sql-services/collection-storage/collection-storage.service';
import { addIcons } from 'ionicons';
import { cogSharp } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-collection-list-item',
  templateUrl: './collection-list-item.component.html',
  styleUrls: ['./collection-list-item.component.scss'],
  imports: [IonicModule, TranslocoPipe],
})
export class CollectionListItemComponent implements OnInit {
  @Input() collection!: Collection;

  @Output() reloadCollections = new EventEmitter<void>();

  public amountOfRelatedSeries!: number;

  public actionSheetButtons!: ActionSheetOptions[];

  constructor(
    private collectionStorageService: CollectionStorageService,
    private seriesStorageService: SeriesStorageService,
    private alertController: AlertController,
    private transloco: TranslocoService,
    private router: Router,
  ) {
    addIcons({
      cogSharp,
    });
  }

  async ngOnInit() {
    try {
      const values: DBSQLiteValues = await this.seriesStorageService.countSeriesRelatedToCollection(
        this.collection.id!,
      );
      const { values: count } = values;
      this.amountOfRelatedSeries = count?.[0]?.['COUNT(id)'] || 0;
    } catch (e) {
      console.error(e);
      this.amountOfRelatedSeries = 0;
    }

    this.actionSheetButtons = [
      {
        text: this.transloco.translate('GLOBAL.VIEW'),
        data: {
          action: ACTION_TYPE.VIEW,
        },
      },
      {
        text: this.transloco.translate('GLOBAL.EDIT'),
        data: {
          action: ACTION_TYPE.EDIT,
        },
      },
      {
        text: this.transloco.translate('GLOBAL.DELETE'),
        role: 'destructive',
        data: {
          action: 'delete',
        },
      },
      {
        text: this.transloco.translate('GLOBAL.CANCEL'),
        role: 'cancel',
        data: {
          action: 'cancel',
        },
      },
    ];
  }

  public goToEdit(): void {
    this.router.navigate(['/collections/edit', this.collection.id]);
  }

  public goToView(): void {
    this.router.navigate(['/series', this.collection!.id]);
  }

  public async deleteCollection() {
    const alert = await this.alertController.create({
      header: this.transloco.translate('GLOBAL.SURE_DELETE'),
      message: this.transloco.translate('COLLECTIONS.LIST.DELETE_COLLECTION'),
      buttons: [
        {
          handler: async () => {
            await this.collectionStorageService.deleteCollectionById(this.collection.id!);
            this.reloadCollections.emit();
            await alert.dismiss();
          },
          text: this.transloco.translate('GLOBAL.DELETE'),
        },
        {
          text: this.transloco.translate('GLOBAL.CANCEL'),
          handler: async () => {
            await alert.dismiss();
          },
        },
      ],
    });

    await alert.present();
  }

  public onActionClicked(event: any) {
    switch (event?.detail?.data?.action) {
      case 'delete':
        this.deleteCollection();
        break;
      case 'edit':
        this.goToEdit();
        break;
      case 'view':
        this.goToView();
        break;

      default:
        return;
    }
  }
}
