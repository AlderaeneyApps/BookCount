import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { PageComponent } from '../../../ui/components/page/page.component';
import { ACTION_TYPE, Collection } from '../../../models';
import { CollectionStorageService } from '../../../sql-services/collection-storage/collection-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { TranslocoService } from '@jsverse/transloco';
import { Observable, of, switchMap } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { CollectionFormService } from '../../../services';
import { FormlyModule, SubmitButtonComponent } from '../../../formly';

@Component({
  selector: 'app-collection-form-v2',
  templateUrl: './collection-form-v2.page.html',
  styleUrls: ['./collection-form-v2.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, PageComponent, FormlyModule, SubmitButtonComponent],
})
export class CollectionFormV2Page implements OnInit {
  public mode: ACTION_TYPE = ACTION_TYPE.CREATE;
  public isCreation: boolean = true;
  public title: string;
  public form: FormGroup = new FormGroup({});
  public fields$!: Observable<FormlyFieldConfig[]>;
  public model$!: Observable<Collection>;
  private collectionId!: number;
  private collection!: Collection;

  constructor(
    private formService: CollectionFormService,
    private collectionStorageService: CollectionStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private translocoService: TranslocoService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.mode = this.route.snapshot.data['mode'];
    this.isCreation = this.mode === ACTION_TYPE.CREATE;
    this.title = `COLLECTIONS.FORM.TITLES.${this.mode.toUpperCase()}`;

    this.fields$ = formService.fields$;
    this.model$ = formService.model$;
  }

  async ngOnInit() {
    try {
      if (!this.isCreation) {
        const loading = await this.loadingCtrl.create({
          message: this.translocoService.translate('GLOBAL.LOADING'),
        });
        loading.present();
        this.cdRef.markForCheck();
        this.collectionStorageService
          .collectionState()
          .pipe(
            switchMap(res => {
              if (res) {
                this.collectionId = this.route.snapshot.params['id'];
                return this.collectionStorageService.getCollectionById(this.collectionId);
              } else {
                return of(false);
              }
            }),
          )
          .subscribe((collection: Collection | boolean) => {
            if (collection) {
              if (!this.isCreation) {
                this.collection = collection as Collection;
                this.formService.setModel(collection as Collection);
              }
              this.formService.buildFields();
              loading.dismiss();
              this.cdRef.markForCheck();
            }
          });
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

    const data = this.form.getRawValue() as Collection;
    if (this.isCreation) {
      try {
        await this.collectionStorageService.addCollection(data.name!);
        await this.router.navigateByUrl('/collections');
      } catch (e) {
        console.error(e);
      }
    } else {
      this.collectionStorageService.updateCollectionById(this.collectionId, data.name!).then(() => {
        this.router.navigate(['/collections']);
      });
    }
  }
}
