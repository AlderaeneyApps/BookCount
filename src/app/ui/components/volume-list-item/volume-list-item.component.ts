import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Observable, Subject } from 'rxjs';
import { ACTION_TYPE, ActionSheetOptions, Volume } from '../../../models';
import { FormGroup } from '@angular/forms';
import { FieldTypeConfig } from '@ngx-formly/core';
import { VolumesStorageService } from '../../../sql-services/volumes-storage/volumes-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-volume-list-item',
  templateUrl: './volume-list-item.component.html',
  styleUrls: ['./volume-list-item.component.scss'],
  imports: [IonicModule, NgOptimizedImage, TranslocoPipe],
})
export class VolumeListItemComponent implements OnInit, OnDestroy {
  @Input() public volume!: Volume;

  @Output() reloadVolumes: EventEmitter<void> = new EventEmitter();

  public form: FormGroup = new FormGroup({});
  public fields$!: Observable<FieldTypeConfig[]>;
  public model$!: Observable<Volume>;

  public actionSheetButtons!: ActionSheetOptions[];

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private volumeStorageService: VolumesStorageService,
    private alertController: AlertController,
    private transloco: TranslocoService,
    private router: Router,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async ngOnInit() {
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

  public onActionClicked(event: any) {
    switch (event?.detail?.data?.action) {
      case 'delete':
        this.deleteVolume();
        break;
      case 'edit':
        this.goToEdit();
        break;

      default:
        return;
    }
  }

  public async deleteVolume() {
    const alert = await this.alertController.create({
      header: this.transloco.translate('GLOBAL.SURE_DELETE'),
      message: this.transloco.translate('VOLUMES.LIST.DELETE_VOLUME'),
      buttons: [
        {
          handler: async () => {
            await this.volumeStorageService.deleteVolumeById(this.volume.id!);
            this.reloadVolumes.emit();
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

  private goToEdit(): void {
    this.router.navigate(['/volumes/edit', this.volume!.id, this.volume!.seriesId]);
  }
}
