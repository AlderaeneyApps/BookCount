import { ChangeDetectorRef, Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { PageComponent } from '../../../ui/components/page/page.component';
import { InfiniteScrollCustomEvent, IonicModule, ViewDidEnter, ViewDidLeave } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { SeriesStorageService } from '../../../sql-services/series-storage/series-storage.service';
import { ActivatedRoute } from '@angular/router';
import { ACTION_TYPE, Series } from '../../../models';
import { BehaviorSubject, Subject } from 'rxjs';
import { SeriesListItemComponent } from '../../../ui/components/series-list-item/series-list-item.component';
import { ModalComponent } from '../../../ui/components/modal/modal.component';
import { ModalFormInfo } from '../../../models/modal-form-info.model';
import { SeriesFormPage } from '../series-form/series-form.page';

@Component({
  selector: 'app-series-home',
  templateUrl: './series-home.page.html',
  styleUrls: ['./series-home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    PageComponent,
    SeriesListItemComponent,
    ModalComponent,
    SeriesFormPage,
  ],
})
export class SeriesHomePage implements ViewDidEnter, ViewDidLeave {
  public collectionId!: number;
  public series!: Series[];

  public showModal: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public formTitle!: string;
  public modalInfo: Subject<ModalFormInfo> = new Subject();

  private destroy$ = new Subject<void>();

  constructor(
    private seriesStorageService: SeriesStorageService,
    private route: ActivatedRoute,
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
      this.collectionId = this.route.snapshot.params['id'];
      this.series = await this.getPaginatedSeries(50, 0);
      this.cdRef.detectChanges();
    } catch (e) {
      this.series = [];
    }
  }

  public async reloadSeries() {
    this.series = await this.getPaginatedSeries(50, 0);
    this.cdRef.markForCheck();
  }

  public async onIonInfinite(event: InfiniteScrollCustomEvent) {
    try {
      const gotSeries: Series[] = await this.getPaginatedSeries(
        50,
        Number(this.series?.length) + 1,
      );
      this.series?.push(...gotSeries);
      await event.target.complete();
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  public async reloadRows() {
    this.showModal.next(false);
    this.series = await this.getPaginatedSeries(50, 0);
    this.cdRef.markForCheck();
  }

  public openCreateForm() {
    this.modalInfo.next({
      mode: ACTION_TYPE.CREATE,
      parentId: this.collectionId,
    });
    this.setTitle(ACTION_TYPE.CREATE);
    this.showModal.next(true);
    this.cdRef.markForCheck();
  }

  public openEditSeries(id: number) {
    this.modalInfo.next({
      mode: ACTION_TYPE.EDIT,
      elementId: id,
      parentId: this.collectionId,
    });
    this.setTitle(ACTION_TYPE.EDIT);
    this.showModal.next(true);
    this.cdRef.markForCheck();
  }

  private async getPaginatedSeries(limit: number, start: number): Promise<Series[]> {
    return await this.seriesStorageService.getSeriesPaginated(limit, start, this.collectionId);
  }

  private setTitle(mode: ACTION_TYPE) {
    this.formTitle = `SERIES.FORM.TITLES.${mode.toUpperCase()}`;
  }
}
