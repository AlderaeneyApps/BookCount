import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { FormlyModule, SubmitButtonComponent } from '../../../formly';
import { IonicModule, LoadingController } from '@ionic/angular';
import { PageComponent } from '../../../ui/components/page/page.component';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ACTION_TYPE, Volume } from '../../../models';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { VolumesFormService } from '../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { VolumesStorageService } from '../../../sql-services/volumes-storage/volumes-storage.service';

@Component({
  selector: 'app-volumes-form',
  templateUrl: './volumes-form.page.html',
  styleUrls: ['./volumes-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormlyModule,
    IonicModule,
    PageComponent,
    SubmitButtonComponent,
    TranslocoPipe,
  ],
  providers: [VolumesFormService],
})
export class VolumesFormPage implements OnInit, OnDestroy {
  public mode: ACTION_TYPE = ACTION_TYPE.CREATE;
  public isCreation: boolean = true;
  public title: string;
  public form: FormGroup = new FormGroup({});
  public model$!: Observable<Volume>;
  public fields!: FormlyFieldConfig[];
  private seriesId!: number;
  private volumeId!: number;
  private volume!: Volume;
  private ngDestroy$ = new Subject<void>();

  constructor(
    private formService: VolumesFormService,
    private volumeStorageService: VolumesStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private translocoService: TranslocoService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.mode = this.route.snapshot.data['mode'];
    this.isCreation = this.mode === ACTION_TYPE.CREATE;
    this.title = `VOLUMES.FORM.TITLES.${this.mode.toUpperCase()}`;
    this.seriesId = this.route.snapshot.params['seriesId'];

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
    try {
      if (!this.isCreation) {
        const loading = await this.loadingCtrl.create({
          message: this.translocoService.translate('GLOBAL.LOADING'),
        });
        await loading.present();
        this.cdRef.markForCheck();
        this.volumeId = this.route.snapshot.params['volumeId'];
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
  }

  public async submit() {
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      return;
    }

    let data: Volume = this.form.getRawValue() as Volume;
    if (this.isCreation) {
      try {
        data = {
          ...data,
          seriesId: this.seriesId,
        };
        await this.volumeStorageService.addVolume(data!);
        await this.router.navigate([`/volumes`, this.seriesId]);
      } catch (e) {
        console.error(e);
      }
    } else {
      this.volumeStorageService.updateVolumeById(this.volumeId, data).then(() => {
        this.router.navigate([`/volumes/${this.seriesId}`]);
      });
    }
  }
}
