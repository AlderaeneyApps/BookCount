import { Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { CollectionStorageService } from './collection-storage/collection-storage.service';
import { Toast } from '@capacitor/toast';
import { SeriesStorageService } from './series-storage/series-storage.service';
import { DB_BOOK_COUNTER } from '../constants';
import { VolumesStorageService } from './volumes-storage/volumes-storage.service';

@Injectable()
export class InitializeAppService {
  isAppInit: boolean = false;
  platform!: string;

  constructor(
    private sqliteService: SQLiteService,
    private collectionStorageService: CollectionStorageService,
    private seriesStorageService: SeriesStorageService,
    private volumeStorageService: VolumesStorageService,
  ) {}

  async initializeApp() {
    await this.sqliteService.initializePlugin().then(async () => {
      this.platform = this.sqliteService.platform;
      try {
        if (this.sqliteService.platform === 'web') {
          await this.sqliteService.initWebStore();
        }
        // Initialize the myuserdb database
        await this.collectionStorageService.initializeDatabase(DB_BOOK_COUNTER);
        await this.seriesStorageService.initializeDatabase(DB_BOOK_COUNTER);
        await this.volumeStorageService.initializeDatabase(DB_BOOK_COUNTER);
        // Here Initialize MOCK_DATA if required

        // Initialize whatever database and/or MOCK_DATA you like

        if (this.sqliteService.platform === 'web') {
          await this.sqliteService.saveToStore(DB_BOOK_COUNTER);
        }

        this.isAppInit = true;
      } catch (error) {
        console.error(`initializeAppError: ${error}`);
        await Toast.show({
          text: `initializeAppError: ${error}`,
          duration: 'long',
        });
      }
    });
  }
}
