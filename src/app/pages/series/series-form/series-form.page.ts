import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { FormlyModule, SubmitButtonComponent } from '../../../formly';
import { TranslocoService } from '@jsverse/transloco';
import { ACTION_TYPE, Series, SeriesZod } from '../../../models';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SeriesFormService } from '../../../services';
import { SeriesStorageService } from '../../../sql-services/series-storage/series-storage.service';
import { nullifyValues } from '../../../functions';
import { ToastController } from '@ionic/angular/standalone';
import { ModalFormInfo } from '../../../models/modal-form-info.model';

@Component({
  selector: 'app-series-form',
  templateUrl: './series-form.page.html',
  styleUrls: ['./series-form.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, FormlyModule, SubmitButtonComponent],
  providers: [SeriesFormService],
})
export class SeriesFormPage implements OnInit, OnDestroy {
  @Input() modalInfo!: Subject<ModalFormInfo>;

  public mode: ACTION_TYPE = ACTION_TYPE.CREATE;
  public isCreation: boolean = true;
  public form: FormGroup = new FormGroup({});
  public model$!: Observable<Series>;
  public fields!: FormlyFieldConfig[];
  @Output() reloadList = new EventEmitter<void>();
  private collectionId!: number | undefined;
  private seriesId!: number | undefined;
  private series!: Series;
  private ngDestroy$ = new Subject<void>();

  constructor(
    private formService: SeriesFormService,
    private seriesStorageService: SeriesStorageService,
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
        const { mode = ACTION_TYPE.CREATE, parentId, elementId } = data;

        try {
          this.mode = mode;
          this.isCreation = this.mode === ACTION_TYPE.CREATE;
          this.collectionId = parentId;

          this.formService.setModel({});
          this.form.reset();

          if (!this.isCreation) {
            const loading = await this.loadingCtrl.create({
              message: this.translocoService.translate('GLOBAL.LOADING'),
            });
            await loading.present();
            this.cdRef.markForCheck();
            this.seriesId = elementId;
            this.series = (
              (await this.seriesStorageService.getSeriesById(this.seriesId!)) as Series[]
            )[0];
            this.formService.setModel(this.series);
            this.formService.buildFields();
            await loading.dismiss();
          } else {
            this.formService.buildFields();
          }
          this.cdRef.markForCheck();
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

    let tmpData = {
      ...nullifyValues(this.form.getRawValue()),
      id: null,
      collectionId: this.isCreation ? Number(this.collectionId) : null,
    } as Series;
    const data = SeriesZod.safeParse(tmpData);

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
        await this.seriesStorageService.addSeries(data.data);
      } else {
        await this.seriesStorageService.updateSeriesById(
          this.seriesId!,
          data.data,
          this.collectionId!,
        );
      }
      this.formService.setModel({});
      this.form.reset();
      this.reloadList.emit();
    } catch (e) {
      console.error(e);
    }
  }
}
