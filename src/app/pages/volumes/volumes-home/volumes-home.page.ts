import { ChangeDetectorRef, Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { InfiniteScrollCustomEvent, IonicModule, ViewDidEnter } from '@ionic/angular';
import { PageComponent } from '../../../ui/components/page/page.component';
import { Volume } from '../../../models';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { VolumeListItemComponent } from '../../../ui/components/volume-list-item/volume-list-item.component';
import { VolumesStorageService } from '../../../sql-services/volumes-storage/volumes-storage.service';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-volumes-home',
  templateUrl: './volumes-home.page.html',
  styleUrls: ['./volumes-home.page.scss'],
  standalone: true,
  imports: [FormsModule, IonicModule, PageComponent, RouterModule, VolumeListItemComponent],
})
export class VolumesHomePage implements ViewDidEnter {
  public volumes!: Volume[];
  public seriesId!: number;

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

  private async getPaginatedVolumes(start: number, limit: number) {
    return await this.volumeStorageService.getVolumesPaginated(limit, start, this.seriesId);
  }
}
