import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { CollectionStorageService } from '../../../sql-services/collection-storage/collection-storage.service';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Router } from '@angular/router';
import { Collection } from '../../../models';
import { of, Subject, switchMap } from 'rxjs';
import { CollectionListItemComponent } from '../../../ui/components/collection-list-item/collection-list-item.component';
import { DB_BOOK_COUNTER } from '../../../constants';

@Component({
  selector: 'app-collections-home',
  templateUrl: './collections-home.page.html',
  styleUrls: ['./collections-home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    TranslocoPipe,
    IonButton,
    CollectionListItemComponent,
  ],
})
export class CollectionsHomePage implements OnInit, OnDestroy {
  public collections: Collection[] | undefined = undefined;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private collectionStorageService: CollectionStorageService,
    private translocoService: TranslocoService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async ngOnInit() {
    try {
      await this.collectionStorageService.initializeDatabase(DB_BOOK_COUNTER);
      this.collectionStorageService
        .collectionState()
        .pipe(
          switchMap((res) => {
            if (res) {
              return this.collectionStorageService.fetchCollections();
            } else {
              return of([]);
            }
          }),
        )
        .subscribe((collections: Collection[]) => {
          this.collections = collections;
        });
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }
}
