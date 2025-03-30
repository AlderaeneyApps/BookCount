import { Injectable } from '@angular/core';
import { SQLiteService } from '../sqlite.service';
import { DbnameVersionService } from '../dbname-version.service';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { BehaviorSubject, Observable } from 'rxjs';
import { SeriesUpgradeStatements } from '../../sql-upgrades/series.upgrade.statements';
import { Series } from '../../models';

@Injectable()
export class SeriesStorageService {
  public seriesList: BehaviorSubject<Series[]> = new BehaviorSubject<Series[]>(
    [],
  );
  private databaseName: string = '';
  private sUpdStmts: SeriesUpgradeStatements = new SeriesUpgradeStatements();
  private readonly versionUpgrades;
  private readonly loadToVersion;
  private db!: SQLiteDBConnection;
  private isSeriesReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private sqliteService: SQLiteService,
    private dbVerService: DbnameVersionService,
  ) {
    this.versionUpgrades = this.sUpdStmts.seriesUpgrades;
    this.loadToVersion =
      this.versionUpgrades[this.versionUpgrades.length - 1].toVersion;
  }

  async initializeDatabase(dbName: string) {
    this.databaseName = dbName;
    // create upgrade statements
    await this.sqliteService.addUpgradeStatement({
      database: this.databaseName,
      upgrade: this.versionUpgrades,
    });
    // create and/or open the database
    this.db = await this.sqliteService.openDatabase(
      this.databaseName,
      false,
      'no-encryption',
      this.loadToVersion,
      false,
    );
    this.dbVerService.set(this.databaseName, this.loadToVersion);
  }

  collectionState() {
    return this.isSeriesReady.asObservable();
  }

  fetchCollections(): Observable<any[]> {
    return this.seriesList.asObservable();
  }

  async loadSeries(collectionId: number): Promise<void> {
    const series: any[] = (
      await this.db.query(`SELECT *
                           FROM series
                           WHERE collectionId = ${collectionId};`)
    ).values as any[];
    this.seriesList.next(series);
  }

  async getSeries(collectionId: number) {
    await this.loadSeries(collectionId);
    this.isSeriesReady.next(true);
  }

  async addSeries(name: string, collectionId: number) {
    const sql = `INSERT INTO series (name, collectionId)
                 VALUES (?);`;
    await this.db.run(sql, [name, collectionId]);
    await this.getSeries(collectionId);
  }

  async updateSeriesById(id: number, name: string, collectionId: number) {
    const sql = `UPDATE series
                 SET name=${name}
                 WHERE id = ${id}`;
    await this.db.run(sql);
    await this.getSeries(collectionId);
  }

  async deleteSeriesById(id: string, collectionId: number) {
    const sql = `DELETE
                 FROM series
                 WHERE id = ${id}`;
    await this.db.run(sql);
    await this.getSeries(collectionId);
  }

  async countSeriesRelatedToCollection(collectionId: number) {
    const sql = `SELECT COUNT(name)
                 FROM series
                 WHERE collectionId = ${collectionId}`;
    return await this.db.query(sql);
  }
}
