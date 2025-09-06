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
import { ACTION_TYPE, Collection, CollectionZod } from '../../../models';
import { CollectionStorageService } from '../../../sql-services/collection-storage/collection-storage.service';
import { IonicModule } from '@ionic/angular';
import { TranslocoService } from '@jsverse/transloco';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { CollectionFormService } from '../../../services';
import { FormlyModule, SubmitButtonComponent } from '../../../formly';
import { LoadingController, ToastController } from '@ionic/angular/standalone';
import { ModalFormInfo } from '../../../models/modal-form-info.model';

@Component({
  selector: 'app-collection-form',
  templateUrl: './collection-form.page.html',
  styleUrls: ['./collection-form.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FormlyModule, SubmitButtonComponent, IonicModule],
})
export class CollectionFormPage implements OnInit, OnDestroy {
  @Input() modalInfo!: Subject<ModalFormInfo>;
  public isCreation: boolean = true;
  public form: FormGroup = new FormGroup({});
  public model$!: Observable<Collection>;
  public fields!: FormlyFieldConfig[];
  @Output() reloadList = new EventEmitter<void>();
  private mode!: ACTION_TYPE;
  private collectionId!: number;
  private collection!: Collection;
  private ngDestroy$ = new Subject<void>();

  constructor(
    private formService: CollectionFormService,
    private collectionStorageService: CollectionStorageService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private translocoService: TranslocoService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnDestroy(): void {
    this.ngDestroy$.next();
    this.ngDestroy$.complete();
  }

  async ngOnInit() {
    this.formService.fields$.pipe(takeUntil(this.ngDestroy$)).subscribe(fields => {
      this.fields = fields;
    });
    this.model$ = this.formService.model$;

    this.modalInfo
      .asObservable()
      .pipe(takeUntil(this.ngDestroy$))
      .subscribe(async (data: ModalFormInfo) => {
        try {
          const { mode = ACTION_TYPE.CREATE, elementId = 0 } = data;
          this.mode = mode;
          this.collectionId = elementId;

          this.formService.setModel({});
          this.form.reset();

          this.isCreation = this.mode === ACTION_TYPE.CREATE;

          if (!this.isCreation) {
            const loading = await this.loadingCtrl.create({
              message: this.translocoService.translate('GLOBAL.LOADING'),
            });
            await loading.present();
            this.cdRef.markForCheck();
            this.collection = (
              (await this.collectionStorageService.getCollectionById(
                this.collectionId,
              )) as Collection[]
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
      });
  }

  public async submit() {
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      return;
    }

    const tmpData = { ...this.form.getRawValue(), id: null } as Collection;
    const data = CollectionZod.safeParse(tmpData);

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
        await this.collectionStorageService.addCollection(data?.data?.name!);
        this.reloadList.emit();
      } else {
        await this.collectionStorageService.updateCollectionById(
          this.collectionId,
          data?.data?.name!,
        );
        this.reloadList.emit();
      }
    } catch (e) {
      console.error(e);
    }
  }
}
