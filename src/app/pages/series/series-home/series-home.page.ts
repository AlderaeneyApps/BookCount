import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageComponent } from '../../../ui/components/page/page.component';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { SeriesStorageService } from '../../../sql-services/series-storage/series-storage.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Series } from '../../../models';
import { of, Subject, switchMap, takeUntil } from 'rxjs';
import { SeriesListItemComponent } from "../../../ui/components/series-list-item/series-list-item.component";

@Component({
  selector: 'app-series-home',
  templateUrl: './series-home.page.html',
  styleUrls: ['./series-home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    PageComponent,
    RouterLink,
    SeriesListItemComponent,
  ],
})
export class SeriesHomePage implements OnInit, OnDestroy {
  public collectionId!: number;
  public series!: Series[];

  private destroy$ = new Subject<void>();

  constructor(
    private seriesStorageService: SeriesStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
  ) {
    addIcons({
      add,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async ngOnInit() {
    try {
      this.collectionId = this.route.snapshot.params['id'];
      await this.seriesStorageService.getSeries(this.collectionId);
      this.seriesStorageService
        .seriesState()
        .pipe(
          takeUntil(this.destroy$),
          switchMap((res) => {
            if (res) {
              return this.seriesStorageService.fetchSeries();
            } else {
              return of([]);
            }
          }),
        )
        .subscribe((series: Series[]) => {
          this.series = series;
        });
    } catch (e) {
     this.series = [];
    }
  }
}
