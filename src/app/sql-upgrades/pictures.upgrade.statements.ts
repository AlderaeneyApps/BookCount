export class PicturesUpgradeStatements {
  picturesUpgrades = [
    {
      toVersion: 1,
      statements: [
        `CREATE TABLE IF NOT EXISTS pictures
         (
           id       INTEGER PRIMARY KEY AUTOINCREMENT,
           picture  BLOB    NOT NULL,
           volumeId INTEGER NOT NULL,
           FOREIGN KEY (volumeId) REFERENCES volumes (id) ON DELETE CASCADE ON UPDATE CASCADE
         );`,
      ],
    },
  ];
}
