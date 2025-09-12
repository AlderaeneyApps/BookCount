export class VolumesUpgradeStatements {
  volumesUpgrades = [
    {
      toVersion: 1,
      statements: `CREATE TABLE IF NOT EXISTS volumes
                   (
                     id           INTEGER PRIMARY KEY AUTOINCREMENT,
                     volumeNumber INTEGER NOT NULL,
                     price        REAL,
                     name         TEXT,
                     quantity      INTEGER,
                     seriesId     INTEGER NOT NULL,
                     FOREIGN KEY (seriesId) REFERENCES series (id) ON DELETE CASCADE ON UPDATE CASCADE
                   );`,
    },
  ];
}
