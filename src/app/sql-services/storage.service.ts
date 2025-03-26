import {Injectable} from '@angular/core';
import {SQLiteService} from "./sqlite.service";
import {DbnameVersionService} from "./dbname-version.service";
import {SQLiteDBConnection} from "@capacitor-community/sqlite";
import {BehaviorSubject, Observable} from "rxjs";
import {CollectionUpgradeStatements} from "../sql-upgrades/collection.upgrade.statements";

@Injectable()
export class StorageService {
  public userList: BehaviorSubject<any[]> =
    new BehaviorSubject<any[]>([]);
  private databaseName: string = "";
  private cUpdStmts: CollectionUpgradeStatements = new CollectionUpgradeStatements();
  private readonly versionUpgrades;
  private readonly loadToVersion;
  private db!: SQLiteDBConnection;
  private isUserReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private sqliteService: SQLiteService,
              private dbVerService: DbnameVersionService) {
    this.versionUpgrades = this.cUpdStmts.collectionUpgrades;
    this.loadToVersion = this.versionUpgrades[this.versionUpgrades.length - 1].toVersion;
  }

  async initializeDatabase(dbName: string) {
    this.databaseName = dbName;
    // create upgrade statements
    await this.sqliteService
      .addUpgradeStatement({
        database: this.databaseName,
        upgrade: this.versionUpgrades
      });
    // create and/or open the database
    this.db = await this.sqliteService.openDatabase(this.databaseName,
      false,
      'no-encryption',
      this.loadToVersion,
      false
    );
    this.dbVerService.set(this.databaseName, this.loadToVersion);

    await this.getUsers();
  }

  userState() {
    return this.isUserReady.asObservable();
  }

  fetchUsers(): Observable<any[]> {
    return this.userList.asObservable();
  }

  async loadUsers() {
    const users: any[] = (await this.db.query('SELECT * FROM users;')).values as any[];
    this.userList.next(users);
  }

  async getUsers() {
    await this.loadUsers();
    this.isUserReady.next(true);
  }

  async addUser(name: string) {
    const sql = `INSERT INTO users (name)
                 VALUES (?);`;
    await this.db.run(sql, [name]);
    await this.getUsers();
  }

  async updateUserById(id: string, active: number) {
    const sql = `UPDATE users
                 SET active=${active}
                 WHERE id = ${id}`;
    await this.db.run(sql);
    await this.getUsers();
  }

  async deleteUserById(id: string) {
    const sql = `DELETE
                 FROM users
                 WHERE id = ${id}`;
    await this.db.run(sql);
    await this.getUsers();
  }
}
