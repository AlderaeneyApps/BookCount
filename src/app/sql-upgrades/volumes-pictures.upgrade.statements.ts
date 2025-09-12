export class VolumesPicturesUpgradeStatements {
  volumesPicturesUpgrades = [
    {
      toVersion: 1,
      statements: `CREATE TABLE IF NOT EXISTS volumesPictures
                   (
                     id           INTEGER PRIMARY KEY AUTOINCREMENT,
                     picture      BLOB,
                     volumeId     INTEGER NOT NULL,
                     FOREIGN KEY (volumeId) REFERENCES volumes (id) ON DELETE CASCADE ON UPDATE CASCADE
                   );`,
    },
  ];
}
