import { Injectable } from '@angular/core';
import { SQLiteService } from '../sqlite.service';
import { DbnameVersionService } from '../dbname-version.service';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { BehaviorSubject, Observable } from 'rxjs';
import { VolumesUpgradeStatements } from '../../sql-upgrades/volumes.upgrade.statements';
import { Volume } from '../../models/volume.model';
import { PicturesUpgradeStatements } from "../../sql-upgrades/pictures.upgrade.statements";
import { Picture } from "../../models";

@Injectable()
export class PicturesStorageService {
  public picturesList: BehaviorSubject<Picture[]> = new BehaviorSubject<Picture[]>(
    [],
  );
  private databaseName: string = '';
  private pUpdStmts: PicturesUpgradeStatements = new PicturesUpgradeStatements();
  private readonly versionUpgrades;
  private readonly loadToVersion;
  public db!: SQLiteDBConnection;
  private isPicturesReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private sqliteService: SQLiteService,
    private dbVerService: DbnameVersionService,
  ) {
    this.versionUpgrades = this.pUpdStmts.picturesUpgrades;
    this.loadToVersion =
      this.versionUpgrades[this.versionUpgrades.length - 1].toVersion;
  }

  async initializeDatabase(dbName: string) {
    this.databaseName = dbName;
    // create upgrade statements
    this.db = await this.sqliteService.openDatabase(
      this.databaseName,
      false,
      'no-encryption',
      this.loadToVersion,
      false
    );

    for (const version of this.versionUpgrades) {
      await this.db.execute(version.statements);
    }

    this.dbVerService.set(this.databaseName, this.loadToVersion);
  }

  picturesState() {
    return this.isPicturesReady.asObservable();
  }

  fetchPictures(): Observable<Volume[]> {
    return this.picturesList.asObservable();
  }

  async loadPictures(volumeId: number) {
    const volumes: any[] = (
      await this.db.query(`SELECT *
                           FROM pictures
                           WHERE volumeId = ${volumeId};`)
    ).values as any[];
    this.picturesList.next(volumes);
  }

  async getPictures(volumeId: number) {
    await this.loadPictures(volumeId);
    this.isPicturesReady.next(true);
  }

  async addPicture(body: Picture) {
    const sql = `INSERT INTO pictures (picture, volumeId) VALUES (?);`;
    await this.db.run(sql, [body.picture, body.volumeId]);
  }

  async updatePictureById(id: number, body: Picture) {
    const sql = `UPDATE pictures
                 SET picture=${body.picture}
                 WHERE id = ${id}`;
    await this.db.run(sql);
  }

  async deletePictureById(id: number) {
    const sql = `DELETE
                 FROM pictures
                 WHERE id = ${id}`;
    await this.db.run(sql);
  }

  async getPictureById(id: number) {
    const sql = `SELECT *
                 FROM pictures
                 WHERE id = ${id}`;
    return (await this.db.query(sql)).values as Picture;
  }

  async countPicturesRelatedToVolume(volumeId: number) {
    const sql = `SELECT COUNT(id)
                 FROM pictures
                 WHERE volumeId = ${volumeId}`;
    return await this.db.query(sql);
  }
}
