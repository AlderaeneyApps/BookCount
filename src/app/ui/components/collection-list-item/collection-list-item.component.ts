import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Collection } from '../../../models';
import { SeriesStorageService } from '../../../sql-services/series-storage/series-storage.service';
import { DBSQLiteValues } from '@capacitor-community/sqlite';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonRow,
} from '@ionic/angular/standalone';
import { TranslocoPipe } from '@jsverse/transloco';
import { DB_BOOK_COUNTER } from '../../../constants';
import { CollectionStorageService } from '../../../sql-services/collection-storage/collection-storage.service';
import { addIcons } from 'ionicons';
import { trashSharp } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collection-list-item',
  templateUrl: './collection-list-item.component.html',
  styleUrls: ['./collection-list-item.component.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    TranslocoPipe,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
  ],
})
export class CollectionListItemComponent implements OnInit {
  @Input() collection!: Collection;
  public amountOfRelatedSeries!: number;

  constructor(
    private collectionStorageService: CollectionStorageService,
    private seriesStorageService: SeriesStorageService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
  ) {
    addIcons({
      trashSharp,
    });
  }

  async ngOnInit() {
    try {
      await this.collectionStorageService.initializeDatabase(DB_BOOK_COUNTER);
      await this.seriesStorageService.initializeDatabase(DB_BOOK_COUNTER);
      const values: DBSQLiteValues =
        await this.seriesStorageService.countSeriesRelatedToCollection(
          this.collection.id!,
        );
      const { values: count } = values;
      this.amountOfRelatedSeries = count?.[0] || 0;
    } catch (e) {
      this.amountOfRelatedSeries = 0;
    }
  }

  public async deleteCollection() {
    await this.collectionStorageService.deleteCollectionById(
      this.collection.id!,
    );
  }

  public goToSeriesList() {
    this.router.navigate(['/series']);
  }
}
