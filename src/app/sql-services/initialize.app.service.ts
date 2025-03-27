import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { CollectionStorageService } from './collection-storage/collection-storage.service';
import { Toast } from '@capacitor/toast';
import { SeriesStorageService } from './series-storage/series-storage.service';

@Injectable()
export class InitializeAppService {
  isAppInit: boolean = false;
  platform!: string;

  constructor(
    private sqliteService: SQLiteService,
    private collectionStorageService: CollectionStorageService,
    private seriesStorageService: SeriesStorageService,
  ) {}

  async initializeApp() {
    await this.sqliteService.initializePlugin().then(async (ret) => {
      this.platform = this.sqliteService.platform;
      try {
        if (this.sqliteService.platform === 'web') {
          await this.sqliteService.initWebStore();
        }
        // Initialize the myuserdb database
        const DB_BOOK_COUNTER = 'book-counter';
        await this.collectionStorageService.initializeDatabase(DB_BOOK_COUNTER);
        await this.seriesStorageService.initializeDatabase(DB_BOOK_COUNTER);
        // Here Initialize MOCK_DATA if required

        // Initialize whatever database and/or MOCK_DATA you like

        if (this.sqliteService.platform === 'web') {
          await this.sqliteService.saveToStore(DB_BOOK_COUNTER);
        }

        this.isAppInit = true;
      } catch (error) {
        console.log(`initializeAppError: ${error}`);
        await Toast.show({
          text: `initializeAppError: ${error}`,
          duration: 'long',
        });
      }
    });
  }
}
