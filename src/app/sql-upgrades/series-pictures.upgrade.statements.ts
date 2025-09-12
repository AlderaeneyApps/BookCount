export class SeriesPicturesUpgradeStatements {
  seriesPicturesUpgrades = [
    {
      toVersion: 1,
      statements: `CREATE TABLE IF NOT EXISTS seriesPictures
         (
           id           INTEGER PRIMARY KEY AUTOINCREMENT,
           seriesId     INTEGER NOT NULL,
           picture      BLOB,
           FOREIGN KEY (seriesId) REFERENCES series (id) ON DELETE CASCADE ON UPDATE CASCADE
         );`,
    },
  ];
}
