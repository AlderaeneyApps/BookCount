import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CollectionStorageService } from '../../../sql-services/collection-storage/collection-storage.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { Collection } from '../../../models';
import { of, Subject, switchMap } from 'rxjs';
import { CollectionListItemComponent } from '../../../ui/components/collection-list-item/collection-list-item.component';
import { PageComponent } from '../../../ui/components/page/page.component';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-collections-home',
  templateUrl: './collections-home.page.html',
  styleUrls: ['./collections-home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    TranslocoPipe,
    CollectionListItemComponent,
    PageComponent,
    RouterLink,
  ],
})
export class CollectionsHomePage implements OnInit, OnDestroy {
  public collections: Collection[] | undefined = undefined;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private collectionStorageService: CollectionStorageService) {
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
      this.collectionStorageService
        .collectionState()
        .pipe(
          switchMap(res => {
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
