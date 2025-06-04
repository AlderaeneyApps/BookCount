import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { FormlyModule, SubmitButtonComponent } from '../../../formly';
import { PageComponent } from '../../../ui/components/page/page.component';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ACTION_TYPE, Collection, Series } from '../../../models';
import { Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { CollectionFormService } from '../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { SeriesStorageService } from '../../../sql-services/series-storage/series-storage.service';

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
})
export class SeriesFormV2Page implements OnInit, OnDestroy {
  public mode: ACTION_TYPE = ACTION_TYPE.CREATE;
  public isCreation: boolean = true;
  public title: string;
  public form: FormGroup = new FormGroup({});
  public model$!: Observable<Collection>;
  public fields!: FormlyFieldConfig[];
  private collectionId!: number;
  private seriesId!: number;
  private series!: Series;
  private ngDestroy$ = new Subject<void>();

  constructor(
    private formService: CollectionFormService,
    private seriesStorageService: SeriesStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private translocoService: TranslocoService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.mode = this.route.snapshot.data['mode'];
    this.isCreation = this.mode === ACTION_TYPE.CREATE;
    this.title = `SERIES.FORM.TITLES.${this.mode.toUpperCase()}`;

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
        this.seriesStorageService
          .seriesState()
          .pipe(
            switchMap(res => {
              if (res) {
                this.collectionId = this.route.snapshot.params['collectionId'];
                this.seriesId = this.route.snapshot.params['seriesId'];
                return this.seriesStorageService.getSeriesById(this.seriesId);
              } else {
                return of(false);
              }
            }),
          )
          .subscribe(async (series: Series[] | boolean) => {
            if (series) {
              if (!this.isCreation) {
                this.series = (series as Series[])[0];
                this.formService.setModel(this.series);
              }
              this.formService.buildFields();
              await loading.dismiss();
              this.cdRef.markForCheck();
            }
          });
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

    const data = this.form.getRawValue() as Series;
    if (this.isCreation) {
      try {
        await this.seriesStorageService.addSeries(data!);
        await this.router.navigateByUrl(`/collections/${this.collectionId}`);
      } catch (e) {
        console.error(e);
      }
    } else {
      this.seriesStorageService
        .updateSeriesById(this.seriesId, data, this.collectionId)
        .then(() => {
          this.router.navigate([`/series/${this.seriesId}`]);
        });
    }
  }
}
