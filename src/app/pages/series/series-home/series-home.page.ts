import { ChangeDetectorRef, Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { PageComponent } from '../../../ui/components/page/page.component';
import { InfiniteScrollCustomEvent, IonicModule, ViewDidEnter, ViewDidLeave } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { SeriesStorageService } from '../../../sql-services/series-storage/series-storage.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Collection, Series } from '../../../models';
import { Subject } from 'rxjs';
import { SeriesListItemComponent } from '../../../ui/components/series-list-item/series-list-item.component';

@Component({
  selector: 'app-series-home',
  templateUrl: './series-home.page.html',
  styleUrls: ['./series-home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, PageComponent, RouterLink, SeriesListItemComponent],
})
export class SeriesHomePage implements ViewDidEnter, ViewDidLeave {
  public collectionId!: number;
  public series!: Series[];

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

  private async getPaginatedSeries(limit: number, start: number): Promise<Collection[]> {
    return await this.seriesStorageService.getSeriesPaginated(limit, start, this.collectionId);
  }
}
