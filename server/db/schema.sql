CREATE TABLE IF NOT EXISTS medications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  genericName TEXT,
  category TEXT NOT NULL,
  description TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conditions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  symptoms TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medicationUses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  medicationId INTEGER NOT NULL,
  conditionId INTEGER NOT NULL,
  reason TEXT NOT NULL,
  effectivenessRating INTEGER,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medicationId) REFERENCES medications(id),
  FOREIGN KEY (conditionId) REFERENCES conditions(id),
  UNIQUE(medicationId, conditionId)
);

CREATE TABLE IF NOT EXISTS researchLinks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sourceType TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  year INTEGER,
  medicationId INTEGER,
  conditionId INTEGER,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medicationId) REFERENCES medications(id),
  FOREIGN KEY (conditionId) REFERENCES conditions(id)
);

CREATE INDEX IF NOT EXISTS idx_med_category ON medications(category);
CREATE INDEX IF NOT EXISTS idx_cond_category ON conditions(category);
CREATE INDEX IF NOT EXISTS idx_med_name ON medications(name);
CREATE INDEX IF NOT EXISTS idx_cond_name ON conditions(name);
