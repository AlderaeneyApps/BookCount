import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PageComponent } from '../../../ui/components/page/page.component';
import { IonicModule, LoadingController } from '@ionic/angular';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTION_TYPE, Collection, Series } from '../../../models';
import { of, switchMap } from 'rxjs';
import { SeriesStorageService } from '../../../sql-services/series-storage/series-storage.service';

@Component({
  selector: 'app-series-form',
  templateUrl: './series-form.page.html',
  styleUrls: ['./series-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    PageComponent,
    ReactiveFormsModule,
    TranslocoPipe,
  ],
})
export class SeriesFormPage implements OnInit {
  public title!: string;
  private readonly mode!: ACTION_TYPE;
  private collectionId!: number;
  private seriesId!: number;
  private readonly isCreation: boolean = false;
  private series!: Series;
  public form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  constructor(
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
  }

  async ngOnInit() {
    this.collectionId = this.route.snapshot.params['collectionId'];
    try {
      if (!this.isCreation) {
        const loading = await this.loadingCtrl.create({
          message: this.translocoService.translate('GLOBAL.LOADING'),
        });
        loading.present();
        this.cdRef.markForCheck();
        this.seriesStorageService
          .seriesState()
          .pipe(
            switchMap((res) => {
              if (res) {
                this.seriesId = this.route.snapshot.params['seriesId'];
                return this.seriesStorageService.getSeriesById(this.seriesId);
              } else {
                return of(false);
              }
            }),
          )
          .subscribe((series: Series[] | boolean) => {
            if (typeof series === 'object') {
              if (!this.isCreation) {
                this.series = (series?.[0] as Series) ?? undefined;
                this.form.get('name')?.setValue(this.series.name);
              }
              loading.dismiss();
              this.cdRef.markForCheck();
            }
          });
      }
    } catch (e) {
      console.error(e);
    }
  }

  public async submit(): Promise<void> {
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = { ...this.form.getRawValue(), collectionId: this.collectionId } as Series;
    if (this.isCreation) {
      await this.seriesStorageService.addSeries(body);
      await this.router.navigate(['/series', this.collectionId]);
    } else {
      await this.seriesStorageService.updateSeriesById(
        this.seriesId,
        body.name,
        this.collectionId,
      );
      await this.router.navigate(['/series', this.collectionId]);
    }
  }
}
