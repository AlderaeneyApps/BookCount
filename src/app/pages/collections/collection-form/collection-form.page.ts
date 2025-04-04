import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CollectionStorageService } from '../../../sql-services/collection-storage/collection-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTION_TYPE, Collection } from '../../../models';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { IonicModule, LoadingController } from '@ionic/angular';
import { of, switchMap } from 'rxjs';
import { PageComponent } from '../../../ui/components/page/page.component';

@Component({
  selector: 'app-collection-form',
  templateUrl: './collection-form.page.html',
  styleUrls: ['./collection-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    TranslocoPipe,
    ReactiveFormsModule,
    PageComponent,
  ],
})
export class CollectionFormPage implements OnInit {
  public mode: ACTION_TYPE = ACTION_TYPE.CREATE;
  public isCreation: boolean = true;
  public form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });
  public title: string;
  private collectionId!: number;
  private collection!: Collection;

  constructor(
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
            switchMap((res) => {
              if (res) {
                this.collectionId = this.route.snapshot.params['id'];
                return this.collectionStorageService.getCollectionById(
                  this.collectionId,
                );
              } else {
                return of(false);
              }
            }),
          )
          .subscribe((collection: Collection | boolean) => {
            if (collection) {
              if (!this.isCreation) {
                this.collection = collection as Collection;
                this.form.get('name')?.setValue(this.collection.name);
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

  public async submit() {
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      return;
    }

    const data = this.form.getRawValue() as Collection;
    if (this.isCreation) {
      try {
        await this.collectionStorageService.addCollection(data.name!);
        this.router.navigateByUrl('/collections');
      } catch (e) {
        console.error(e);
      }
    } else {
      this.collectionStorageService
        .updateCollectionById(this.collectionId, data.name!)
        .then(() => {
          this.router.navigate(['/collections']);
        });
    }
  }
}
