import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { FormlyModule, SubmitButtonComponent } from '../../../formly';
import { PageComponent } from '../../../ui/components/page/page.component';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ACTION_TYPE, Series, SeriesZod } from '../../../models';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { SeriesFormService } from '../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { SeriesStorageService } from '../../../sql-services/series-storage/series-storage.service';
import { nullifyValues } from '../../../functions';
import { ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-series-form-v2',
  templateUrl: './series-form-v2.page.html',
  styleUrls: ['./series-form-v2.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FormlyModule,
    PageComponent,
    SubmitButtonComponent,
    TranslocoPipe,
  ],
  providers: [SeriesFormService],
})
export class SeriesFormV2Page implements OnInit, OnDestroy {
  public mode: ACTION_TYPE = ACTION_TYPE.CREATE;
  public isCreation: boolean = true;
  public title: string;
  public form: FormGroup = new FormGroup({});
  public model$!: Observable<Series>;
  public fields!: FormlyFieldConfig[];
  private collectionId!: number;
  private seriesId!: number;
  private series!: Series;
  private ngDestroy$ = new Subject<void>();

  constructor(
    private formService: SeriesFormService,
    private seriesStorageService: SeriesStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private translocoService: TranslocoService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.mode = this.route.snapshot.data['mode'];
    this.isCreation = this.mode === ACTION_TYPE.CREATE;
    this.title = `SERIES.FORM.TITLES.${this.mode.toUpperCase()}`;
    this.collectionId = this.route.snapshot.params['collectionId'];

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
        this.seriesId = this.route.snapshot.params['seriesId'];
        this.series = (
          (await this.seriesStorageService.getSeriesById(this.seriesId)) as Series[]
        )[0];
        this.formService.setModel(this.series);
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

    if (this.isCreation) {
      try {
        await this.seriesStorageService.addSeries(data.data);
        await this.router.navigate([`/series`, this.collectionId]);
      } catch (e) {
        console.error(e);
      }
    } else {
      await this.seriesStorageService.updateSeriesById(this.seriesId, data.data, this.collectionId);
      await this.router.navigate(['/series', this.collectionId]);
    }
  }
}
