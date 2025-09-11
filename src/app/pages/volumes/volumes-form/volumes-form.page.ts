import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { FormlyModule, SubmitButtonComponent } from '../../../formly';
import { IonicModule, LoadingController } from '@ionic/angular';
import { TranslocoService } from '@jsverse/transloco';
import { ACTION_TYPE, Volume, VolumeZod } from '../../../models';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { VolumesFormService } from '../../../services';
import { VolumesStorageService } from '../../../sql-services/volumes-storage/volumes-storage.service';
import { ToastController } from '@ionic/angular/standalone';
import { nullifyValues } from '../../../functions';
import { ModalFormInfo } from '../../../models/modal-form-info.model';

@Component({
  selector: 'app-volumes-form',
  templateUrl: './volumes-form.page.html',
  styleUrls: ['./volumes-form.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FormlyModule, IonicModule, SubmitButtonComponent],
  providers: [VolumesFormService],
})
export class VolumesFormPage implements OnInit, OnDestroy {
  @Input() modalInfo!: Subject<ModalFormInfo>;
  public mode: ACTION_TYPE = ACTION_TYPE.CREATE;
  public isCreation: boolean = true;
  public form: FormGroup = new FormGroup({});
  public model$!: Observable<Volume>;
  public fields!: FormlyFieldConfig[];
  @Output() reloadList = new EventEmitter<void>();
  private seriesId!: number;
  private volumeId!: number;
  private volume!: Volume;
  private ngDestroy$ = new Subject<void>();

  constructor(
    private formService: VolumesFormService,
    private volumeStorageService: VolumesStorageService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private translocoService: TranslocoService,
    private cdRef: ChangeDetectorRef,
  ) {
    formService.fields$.pipe(takeUntil(this.ngDestroy$)).subscribe(fields => {
      this.fields = fields;
    });
    this.model$ = formService.model$;
  }

  ngOnDestroy(): void {
    this.ngDestroy$.next();
    this.ngDestroy$.complete();
  }

  async ngOnInit() {
    this.modalInfo
      .asObservable()
      .pipe(takeUntil(this.ngDestroy$))
      .subscribe(async (data: ModalFormInfo) => {
        const { mode = ACTION_TYPE.CREATE, parentId = -1, elementId = -1 } = data;

        this.mode = mode;
        this.isCreation = this.mode === ACTION_TYPE.CREATE;
        this.seriesId = parentId;

        try {
          if (!this.isCreation) {
            const loading = await this.loadingCtrl.create({
              message: this.translocoService.translate('GLOBAL.LOADING'),
            });
            await loading.present();
            this.cdRef.markForCheck();
            this.volumeId = elementId;
            const tmpVolume = await this.volumeStorageService.getVolumeById(this.volumeId);
            if (tmpVolume) {
              this.volume = (tmpVolume as Volume[])[0];
              this.formService.setModel(this.volume);
            }

            this.formService.buildFields();
            await loading.dismiss();
            this.cdRef.markForCheck();
          } else {
            this.formService.buildFields();
          }
        } catch (e) {
          console.error(e);
        }
      });
  }

  public async submit() {
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      return;
    }

    let tmpData: Volume = {
      ...nullifyValues(this.form.getRawValue()),
      id: null,
      seriesId: this.isCreation ? Number(this.seriesId) : null,
    } as Volume;
    const data = VolumeZod.safeParse(tmpData);

    if (data.error?.issues && data.error.issues.length > 0) {
      for (const error of data.error.issues) {
        await (
          await this.toastController.create({
            message: error.message,
            duration: 5000,
            position: 'bottom',
          })
        ).present();
      }
      return;
    }

    try {
      if (this.isCreation) {
        await this.volumeStorageService.addVolume(data!.data);
      } else {
        await this.volumeStorageService.updateVolumeById(this.volumeId, data.data);
      }
      this.formService.setModel({});
      this.form.reset();
      this.reloadList.emit();
    } catch (e) {
      console.error(e);
    }
  }
}
