import { Injectable } from '@angular/core';
import { SQLiteService } from '../sqlite.service';
import { DbnameVersionService } from '../dbname-version.service';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionUpgradeStatements } from '../../sql-upgrades/collection.upgrade.statements';
import { Collection } from '../../models';

@Injectable()
export class CollectionStorageService {
  public collectionList: BehaviorSubject<Collection[]> = new BehaviorSubject<Collection[]>([]);
  private databaseName: string = '';
  private cUpdStmts: CollectionUpgradeStatements = new CollectionUpgradeStatements();
  private readonly versionUpgrades;
  private readonly loadToVersion;
  private db!: SQLiteDBConnection;
  private isCollectionsReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private sqliteService: SQLiteService,
    private dbVerService: DbnameVersionService,
  ) {
    this.versionUpgrades = this.cUpdStmts.collectionUpgrades;
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

    await this.getCollections();
  }

  collectionState() {
    return this.isCollectionsReady.asObservable();
  }

  fetchCollections(): Observable<any[]> {
    return this.collectionList.asObservable();
  }

  async loadCollections() {
    const collections: any[] = (await this.db.query('SELECT * FROM collection;')).values as any[];
    this.collectionList.next(collections);
  }

  async getCollections() {
    await this.loadCollections();
    this.isCollectionsReady.next(true);
  }

  async addCollection(name: string) {
    const sql = `INSERT INTO collection (name)
                 VALUES (?);`;
    await this.db.run(sql, [name]);
    await this.getCollections();
  }

  async updateCollectionById(id: number, name: string) {
    const sql = `UPDATE collection
                 SET name='${name}'
                 WHERE id = ${id}`;
    await this.db.run(sql);
    await this.getCollections();
  }

  async deleteCollectionById(id: number) {
    const sql = `DELETE
                 FROM collection
                 WHERE id = ${id}`;
    await this.db.run(sql);
    await this.getCollections();
  }

  async getCollectionById(id: number) {
    const sql = `SELECT *
                 FROM collection
                 WHERE id = ${id}`;
    return (await this.db.query(sql)).values as Collection;
  }

  async getCollectionsPaginated(limit: number, start: number) {
    const sql = `SELECT *
                 FROM collection LIMIT ${limit}
                 OFFSET ${start};`;

    return (await this.db.query(sql)).values as Collection[];
  }
}
