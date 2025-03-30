export class CollectionUpgradeStatements {
  collectionUpgrades = [
    {
      toVersion: 1,
      statements: [
        `CREATE TABLE IF NOT EXISTS collection
         (
           id   INTEGER PRIMARY KEY AUTOINCREMENT,
           name TEXT NOT NULL
         );`,
      ],
    },
  ];
}
