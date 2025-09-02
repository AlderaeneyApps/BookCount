import { Injectable } from '@angular/core';
import { SQLiteService } from '../sqlite.service';
import { DbnameVersionService } from '../dbname-version.service';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { BehaviorSubject, Observable } from 'rxjs';
import { VolumesUpgradeStatements } from '../../sql-upgrades/volumes.upgrade.statements';
import { Volume } from '../../models';

@Injectable()
export class VolumesStorageService {
  public volumeList: BehaviorSubject<Volume[]> = new BehaviorSubject<Volume[]>([]);
  private databaseName: string = '';
  private vUpdStmts: VolumesUpgradeStatements = new VolumesUpgradeStatements();
  private readonly versionUpgrades;
  private readonly loadToVersion;
  private db!: SQLiteDBConnection;
  private isVolumesReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private sqliteService: SQLiteService,
    private dbVerService: DbnameVersionService,
  ) {
    this.versionUpgrades = this.vUpdStmts.volumesUpgrades;
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

  volumeState() {
    return this.isVolumesReady.asObservable();
  }

  fetchVolumes(): Observable<Volume[]> {
    return this.volumeList.asObservable();
  }

  async loadVolumes(seriesId: number) {
    const volumes: any[] = (
      await this.db.query(`SELECT *
                           FROM volumes
                           WHERE seriesId = ${seriesId};`)
    ).values as any[];
    this.volumeList.next(volumes);
  }

  async getVolumes(seriesId: number) {
    await this.loadVolumes(seriesId);
    this.isVolumesReady.next(true);
  }

  async addVolume(body: Volume) {
    const sql = `INSERT INTO volumes (volumeNumber, price, seriesId, name, picture)
                 VALUES (?, ?, ?, ?, ?);`;
    await this.db.run(sql, [body.volumeNumber, body.price, body.seriesId, body.name, body.picture]);
  }

  async updateVolumeById(id: number, body: Volume) {
    const sql = `UPDATE volumes
                 SET volumeNumber=${body.volumeNumber},
                     price       = ${body.price},
                     name        = ${body.name},
                     picture     = ${body.picture}
                 WHERE id = ${id}`;
    await this.db.run(sql);
  }

  async deleteVolumeById(id: number) {
    const sql = `DELETE
                 FROM volumes
                 WHERE id = ${id}`;
    await this.db.run(sql);
  }

  async getVolumeById(id: number) {
    const sql = `SELECT *
                 FROM volumes
                 WHERE id = ${id}`;
    return (await this.db.query(sql)).values as Volume[];
  }

  async countVolumesRelatedToSeries(seriesId: number) {
    const sql = `SELECT COUNT(id)
                 FROM volumes
                 WHERE seriesId = ${seriesId}`;
    return await this.db.query(sql);
  }

  async getVolumesPaginated(limit: number, start: number, seriesId: number) {
    const sql = `SELECT *
                 FROM volumes
                 WHERE seriesId = ${seriesId}
                 LIMIT ${limit} OFFSET ${start};`;

    return (await this.db.query(sql)).values as Volume[];
  }
}
