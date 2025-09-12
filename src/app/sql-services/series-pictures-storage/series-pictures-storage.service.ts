import { Injectable } from '@angular/core';
import { SQLiteService } from '../sqlite.service';
import { DbnameVersionService } from '../dbname-version.service';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Picture } from '../../models';
import { SeriesPicturesUpgradeStatements } from '../../sql-upgrades/series-pictures.upgrade.statements';

@Injectable()
export class SeriesPicturesStorageService {
  private databaseName: string = '';
  private sUpdStmts: SeriesPicturesUpgradeStatements = new SeriesPicturesUpgradeStatements();
  private readonly versionUpgrades;
  private readonly loadToVersion;
  private db!: SQLiteDBConnection;

  constructor(
    private sqliteService: SQLiteService,
    private dbVerService: DbnameVersionService,
  ) {
    this.versionUpgrades = this.sUpdStmts.seriesPicturesUpgrades;
    this.loadToVersion = this.versionUpgrades[this.versionUpgrades.length - 1].toVersion;
  }

  async initializeDatabase(dbName: string) {
    this.databaseName = dbName;
    // create upgrade statements
    this.db = await this.sqliteService.openDatabase(
      this.databaseName,
      false,
      'no-encryption',
      this.loadToVersion,
      false,
    );

    for (const version of this.versionUpgrades) {
      await this.db.execute(version.statements);
    }

    this.dbVerService.set(this.databaseName, this.loadToVersion);
  }

  async addPicture(body: Picture | undefined) {
    if (body) {
      const sql = `INSERT INTO seriesPictures (picture, seriesId)
                   VALUES (?, ?);`;
      await this.db.run(sql, [body.picture, body.seriesId]);
    }
  }

  async deletePictureById(id: number) {
    const sql = `DELETE
                 FROM seriesPictures
                 WHERE id = ${id}`;
    await this.db.run(sql);
  }

  async getPicturesFromSeries(seriesId: number) {
    const sql = `SELECT * FROM seriesPictures WHERE seriesId = ${seriesId};`;

    return (await this.db.query(sql)).values as Picture[];
  }
}
