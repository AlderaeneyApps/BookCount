import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { PageComponent } from '../../../ui/components/page/page.component';
import { ACTION_TYPE, Collection, CollectionZod } from '../../../models';
import { CollectionStorageService } from '../../../sql-services/collection-storage/collection-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { CollectionFormService } from '../../../services';
import { FormlyModule, SubmitButtonComponent } from '../../../formly';
import { LoadingController, ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-collection-form-v2',
  templateUrl: './collection-form-v2.page.html',
  styleUrls: ['./collection-form-v2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PageComponent,
    FormlyModule,
    SubmitButtonComponent,
    IonicModule,
    TranslocoPipe,
  ],
})
export class CollectionFormV2Page implements OnInit, OnDestroy {
  public mode: ACTION_TYPE = ACTION_TYPE.CREATE;
  public isCreation: boolean = true;
  public title: string;
  public form: FormGroup = new FormGroup({});
  public model$!: Observable<Collection>;
  public fields!: FormlyFieldConfig[];
  private collectionId!: number;
  private collection!: Collection;
  private ngDestroy$ = new Subject<void>();

  constructor(
    private formService: CollectionFormService,
    private collectionStorageService: CollectionStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private translocoService: TranslocoService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.mode = this.route.snapshot.data['mode'];
    this.isCreation = this.mode === ACTION_TYPE.CREATE;
    this.title = `COLLECTIONS.FORM.TITLES.${this.mode.toUpperCase()}`;

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
        this.collectionId = this.route.snapshot.params['id'];
        this.collection = (
          (await this.collectionStorageService.getCollectionById(this.collectionId)) as Collection[]
        )[0];
        this.formService.setModel(this.collection);
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

    const tmpData = { ...this.form.getRawValue(), id: null } as Collection;
    const data = CollectionZod.safeParse(tmpData);

    console.log(data);

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
        await this.collectionStorageService.addCollection(data?.data?.name!);
        await this.router.navigateByUrl('/collections');
      } catch (e) {
        console.error(e);
      }
    } else {
      this.collectionStorageService
        .updateCollectionById(this.collectionId, data?.data?.name!)
        .then(() => {
          this.router.navigate(['/collections']);
        });
    }
  }
}
