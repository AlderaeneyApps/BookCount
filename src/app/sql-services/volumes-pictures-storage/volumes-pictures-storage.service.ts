import { Injectable } from '@angular/core';
import { SQLiteService } from '../sqlite.service';
import { DbnameVersionService } from '../dbname-version.service';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Picture } from '../../models';
import { VolumesPicturesUpgradeStatements } from '../../sql-upgrades/volumes-pictures.upgrade.statements';

@Injectable()
export class VolumesPicturesStorageService {
  private databaseName: string = '';
  private vUpdStmts: VolumesPicturesUpgradeStatements = new VolumesPicturesUpgradeStatements();
  private readonly versionUpgrades;
  private readonly loadToVersion;
  private db!: SQLiteDBConnection;

  constructor(
    private sqliteService: SQLiteService,
    private dbVerService: DbnameVersionService,
  ) {
    this.versionUpgrades = this.vUpdStmts.volumesPicturesUpgrades;
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
      const sql = `INSERT INTO volumesPictures (picture, volumeId)
                   VALUES (?, ?);`;
      await this.db.run(sql, [body.picture, body.volumeId]);
    }
  }

  async deletePictureById(id: number) {
    const sql = `DELETE
                 FROM volumesPictures
                 WHERE id = ${id}`;
    await this.db.run(sql);
  }

  async getPicturesFromVolume(volumeId: number) {
    const sql = `SELECT * FROM volumesPictures WHERE volumeId = ${volumeId};`;

    return (await this.db.query(sql)).values as Picture[];
  }
}
