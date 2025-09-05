import { ChangeDetectorRef, Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CollectionStorageService } from '../../../sql-services/collection-storage/collection-storage.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { ACTION_TYPE, Collection } from '../../../models';
import { BehaviorSubject, Subject } from 'rxjs';
import { CollectionListItemComponent } from '../../../ui/components/collection-list-item/collection-list-item.component';
import { PageComponent } from '../../../ui/components/page/page.component';
import { InfiniteScrollCustomEvent, IonicModule, ViewDidEnter, ViewDidLeave } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { ModalComponent } from '../../../ui/components/modal/modal.component';
import { CollectionFormV2Page } from '../collection-form-v2/collection-form-v2.page';
import { ModalFormInfo } from '../../../models/modal-form-info.model';

@Component({
  selector: 'app-collections-home',
  templateUrl: './collections-home.page.html',
  styleUrls: ['./collections-home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    TranslocoPipe,
    CollectionListItemComponent,
    PageComponent,
    ModalComponent,
    CollectionFormV2Page,
  ],
})
export class CollectionsHomePage implements ViewDidLeave, ViewDidEnter {
  public collections: Collection[] | undefined = undefined;

  public formTitle!: string;
  public showModal: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public modalInfo: Subject<ModalFormInfo> = new Subject();

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private collectionStorageService: CollectionStorageService,
    private cdRef: ChangeDetectorRef,
  ) {
    addIcons({
      add,
    });
  }

  ionViewDidLeave(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async ionViewDidEnter() {
    try {
      this.collections = await this.getPaginatedCollections(50, 0);
      this.cdRef.markForCheck();
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  public async onIonInfinite(event: InfiniteScrollCustomEvent) {
    try {
      const gotCollections: Collection[] = await this.getPaginatedCollections(
        50,
        Number(this.collections?.length) + 1,
      );
      this.collections?.push(...gotCollections);
      await event.target.complete();
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  public async reloadCollections() {
    this.collections = await this.getPaginatedCollections(50, 0);
    this.cdRef.markForCheck();
  }

  public async reloadRows() {
    this.showModal.next(false);
    this.collections = await this.getPaginatedCollections(50, 0);
    this.cdRef.markForCheck();
  }

  public openCreateForm() {
    this.modalInfo.next({
      mode: ACTION_TYPE.CREATE,
    });
    this.setTitle(ACTION_TYPE.CREATE);
    this.showModal.next(true);
    this.cdRef.markForCheck();
  }

  public openEditCollection(id: number) {
    this.modalInfo.next({
      mode: ACTION_TYPE.EDIT,
      elementId: id,
    });
    this.setTitle(ACTION_TYPE.EDIT);
    this.showModal.next(true);
    this.cdRef.markForCheck();
  }

  private setTitle(mode: ACTION_TYPE) {
    this.formTitle = `COLLECTIONS.FORM.TITLES.${mode.toUpperCase()}`;
  }

  private async getPaginatedCollections(limit: number, start: number): Promise<Collection[]> {
    return await this.collectionStorageService.getCollectionsPaginated(limit, start);
  }
}
