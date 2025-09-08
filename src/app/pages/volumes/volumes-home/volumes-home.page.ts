import { ChangeDetectorRef, Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { InfiniteScrollCustomEvent, IonicModule, ViewDidEnter } from '@ionic/angular';
import { PageComponent } from '../../../ui/components/page/page.component';
import { ACTION_TYPE, Volume } from '../../../models';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { VolumeListItemComponent } from '../../../ui/components/volume-list-item/volume-list-item.component';
import { VolumesStorageService } from '../../../sql-services/volumes-storage/volumes-storage.service';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { BehaviorSubject, Subject } from 'rxjs';
import { ModalFormInfo } from '../../../models/modal-form-info.model';
import { ModalComponent } from '../../../ui/components/modal/modal.component';
import { VolumesFormPage } from '../volumes-form/volumes-form.page';

@Component({
  selector: 'app-volumes-home',
  templateUrl: './volumes-home.page.html',
  styleUrls: ['./volumes-home.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonicModule,
    PageComponent,
    RouterModule,
    VolumeListItemComponent,
    ModalComponent,
    VolumesFormPage,
  ],
})
export class VolumesHomePage implements ViewDidEnter {
  public volumes!: Volume[];
  public seriesId!: number;

  public formTitle!: string;
  public modalInfo: Subject<ModalFormInfo> = new Subject();
  public showModal: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private volumeStorageService: VolumesStorageService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
  ) {
    addIcons({
      add,
    });
  }

  async ionViewDidEnter() {
    this.seriesId = this.route.snapshot.params['seriesId'];

    this.volumes = await this.getPaginatedVolumes(0, 50);
    this.cdRef.markForCheck();
  }

  public async reloadVolumes() {
    this.volumes = await this.getPaginatedVolumes(0, 50);
    this.cdRef.markForCheck();
  }

  public async onIonInfinite(event: InfiniteScrollCustomEvent) {
    if (this.volumes && this.volumes.length > 0) {
      try {
        const gotVolumes = await this.getPaginatedVolumes(this.volumes.length + 1, 50);
        this.volumes.push(...gotVolumes);
        this.cdRef.markForCheck();
        await event.target.complete();
      } catch (err) {
        throw new Error(`Error: ${err}`);
      }
    }
  }

  public openCreateForm() {
    this.modalInfo.next({
      mode: ACTION_TYPE.CREATE,
      parentId: this.seriesId,
    });
    this.setTitle(ACTION_TYPE.CREATE);
    this.showModal.next(true);
    this.cdRef.markForCheck();
  }

  public openEditVolumes(id: number) {
    this.modalInfo.next({
      mode: ACTION_TYPE.EDIT,
      elementId: id,
      parentId: this.seriesId,
    });
    this.setTitle(ACTION_TYPE.EDIT);
    this.showModal.next(true);
    this.cdRef.markForCheck();
  }

  public async reloadRows() {
    this.showModal.next(false);
    this.volumes = await this.getPaginatedVolumes(0, 50);
    this.cdRef.markForCheck();
  }

  private async getPaginatedVolumes(start: number, limit: number) {
    return await this.volumeStorageService.getVolumesPaginated(limit, start, this.seriesId);
  }

  private setTitle(mode: string) {
    this.formTitle = `VOLUMES.FORM.TITLES.${mode.toUpperCase()}`;
  }
}
