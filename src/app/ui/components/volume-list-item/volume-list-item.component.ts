import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ACTION_TYPE, ActionSheetOptions, Volume } from '../../../models';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { VolumesStorageService } from '../../../sql-services/volumes-storage/volumes-storage.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { cogSharp } from 'ionicons/icons';
import { FormlyModule } from '../../../formly';
import { VolumeListItemFormService } from '../../../services';

@Component({
  selector: 'app-volume-list-item',
  templateUrl: './volume-list-item.component.html',
  styleUrls: ['./volume-list-item.component.scss'],
  imports: [IonicModule, NgOptimizedImage, TranslocoPipe, AsyncPipe, FormlyModule],
  providers: [VolumeListItemFormService],
})
export class VolumeListItemComponent implements OnInit, OnDestroy {
  @Input() public volume!: Volume;

  @Output() reloadVolumes: EventEmitter<void> = new EventEmitter();

  public form: FormGroup = new FormGroup({});
  public fields!: FormlyFieldConfig[];
  public model$!: Observable<Volume>;

  public actionSheetButtons!: ActionSheetOptions[];

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private formService: VolumeListItemFormService,
    private volumeStorageService: VolumesStorageService,
    private alertController: AlertController,
    private transloco: TranslocoService,
    private router: Router,
  ) {
    addIcons({
      cogSharp,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async ngOnInit() {
    this.formService.fields$.pipe(takeUntil(this.destroy$)).subscribe(fields => {
      this.fields = fields;
    });
    this.model$ = this.formService.model$;
    this.formService.setModel(this.volume);
    this.formService.buildFields(ACTION_TYPE.VIEW);

    this.actionSheetButtons = [
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

  public async onActionClicked(event: any) {
    switch (event?.detail?.data?.action) {
      case 'delete':
        await this.deleteVolume();
        break;
      case 'edit':
        await this.goToEdit();
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

  private async goToEdit() {
    await this.router.navigate(['/volumes/edit', this.volume!.id, this.volume!.seriesId]);
  }
}
