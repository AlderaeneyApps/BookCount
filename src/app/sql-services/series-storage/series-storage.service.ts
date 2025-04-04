import { Injectable } from '@angular/core';
import { SQLiteService } from '../sqlite.service';
import { DbnameVersionService } from '../dbname-version.service';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { BehaviorSubject, Observable } from 'rxjs';
import { SeriesUpgradeStatements } from '../../sql-upgrades/series.upgrade.statements';
import { Collection, Series } from "../../models";

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

  seriesState() {
    return this.isSeriesReady.asObservable();
  }

  fetchSeries(): Observable<Series[]> {
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

  async getSeriesById(id: number): Promise<Series[]> {
    const sql = `SELECT * FROM series WHERE id = ${id}`;
    return (await this.db.query(sql)).values as Series[];
  }

  async addSeries(body: Series) {
    const sql = `INSERT INTO series (name, price, collectionId)
                 VALUES (?, ?, ?);`;
    await this.db.run(sql, [body.name, body.price, body.collectionId]);
    await this.getSeries(body.collectionId);
  }

  async updateSeriesById(id: number, name: string, collectionId: number) {
    const sql = `UPDATE series
                 SET name=${name}
                 WHERE id = ${id}`;
    await this.db.run(sql);
    await this.getSeries(collectionId);
  }

  async deleteSeriesById(id: number, collectionId: number) {
    const sql = `DELETE
                 FROM series
                 WHERE id = ${id}`;
    await this.db.run(sql);
    await this.getSeries(collectionId);
  }

  async countSeriesRelatedToCollection(collectionId: number) {
    const sql = `SELECT COUNT(id)
                 FROM series
                 WHERE collectionId = ${collectionId}`;
    return await this.db.query(sql);
  }
}
