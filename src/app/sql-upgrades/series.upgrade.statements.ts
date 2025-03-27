export class SeriesUpgradeStatements {
  seriesUpgrades = [
    {
      toVersion: 1,
      statements: [
        `CREATE TABLE IF NOT EXISTS series
         (
           id
           INTEGER
           PRIMARY
           KEY
           AUTOINCREMENT,
           name
           TEXT
           NOT
           NULL,
         ) FOREIGN KEY
         (
           collectionId
         ) REFERENCES collection
         (
           PrimaryKeyField
         ) ON DELETE CASCADE
           ON UPDATE CASCADE;`,
      ],
    },
  ];
}
