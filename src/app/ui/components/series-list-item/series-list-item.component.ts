import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ACTION_TYPE, ActionSheetOptions, Series } from '../../../models';
import { AlertController, IonicModule } from '@ionic/angular';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { SeriesStorageService } from '../../../sql-services/series-storage/series-storage.service';
import { Router } from '@angular/router';
import { VolumesStorageService } from '../../../sql-services/volumes-storage/volumes-storage.service';
import { DBSQLiteValues } from '@capacitor-community/sqlite';
import { addIcons } from 'ionicons';
import { cogSharp } from 'ionicons/icons';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-series-list-item',
  templateUrl: './series-list-item.component.html',
  styleUrls: ['./series-list-item.component.scss'],
  imports: [IonicModule, TranslocoPipe, NgOptimizedImage],
})
export class SeriesListItemComponent implements OnInit {
  @Input() series!: Series;

  @Output() reloadSeries: EventEmitter<void> = new EventEmitter<void>();

  public volumesCount: number | undefined;

  public actionSheetButtons!: ActionSheetOptions[];

  constructor(
    private seriesStorageService: SeriesStorageService,
    private volumeStorageService: VolumesStorageService,
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
      const values: DBSQLiteValues = await this.volumeStorageService.countVolumesRelatedToSeries(
        this.series.id!,
      );
      const { values: count } = values as any;
      this.volumesCount = count?.['COUNT(id)'] ?? 0;
      console.log(this.volumesCount);
    } catch (e) {
      console.error(e);
      this.volumesCount = 0;
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

  public async deleteSeries() {
    const alert = await this.alertController.create({
      header: this.transloco.translate('GLOBAL.SURE_DELETE'),
      message: this.transloco.translate('SERIES.LIST.DELETE_SERIES'),
      buttons: [
        {
          handler: async () => {
            await this.seriesStorageService.deleteSeriesById(
              this.series.id!,
              this.series.collectionId!,
            );
            this.reloadSeries.emit();
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
        this.deleteSeries();
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

  private goToEdit(): void {
    this.router.navigate(['/series/edit', this.series!.id, this.series!.collectionId]);
  }

  private goToView(): void {
    this.router.navigate(['/volumes', this.series!.id]);
  }
}
