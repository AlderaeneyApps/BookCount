import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CollectionStorageService } from '../../../sql-services/collection-storage/collection-storage.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { Collection } from '../../../models';
import { Subject } from 'rxjs';
import { CollectionListItemComponent } from '../../../ui/components/collection-list-item/collection-list-item.component';
import { PageComponent } from '../../../ui/components/page/page.component';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
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

  constructor(
    private collectionStorageService: CollectionStorageService,
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

  private async getPaginatedCollections(limit: number, start: number): Promise<Collection[]> {
    return await this.collectionStorageService.getCollectionsPaginated(limit, start);
  }
}
