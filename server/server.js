import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let db;

const initDB = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(path.join(__dirname, 'db', 'medications.db'), async (err) => {
      if (err) return reject(err);

      const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
      db.exec(schema, async (err) => {
        if (err) return reject(err);

        db.all('SELECT COUNT(*) as count FROM medications', async (err, rows) => {
          if (err) return reject(err);

          if (rows[0].count === 0) {
            const seeds = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'seeds.json'), 'utf8'));
            await seedDB(seeds);
          }
          resolve();
        });
      });
    });
  });
};

const seedDB = (seeds) => {
  return new Promise((resolve, reject) => {
    db.serialize(async () => {
      try {
        for (const med of seeds.medications) {
          db.run('INSERT OR IGNORE INTO medications (name, genericName, category, description) VALUES (?, ?, ?, ?)',
            [med.name, med.genericName, med.category, med.description]);
        }

        for (const cond of seeds.conditions) {
          db.run('INSERT OR IGNORE INTO conditions (name, category, description, symptoms) VALUES (?, ?, ?, ?)',
            [cond.name, cond.category, cond.description, cond.symptoms]);
        }

        setTimeout(() => {
          for (const use of seeds.medicationUses) {
            db.run('INSERT OR IGNORE INTO medicationUses (medicationId, conditionId, reason, effectivenessRating) VALUES (?, ?, ?, ?)',
              [use.medicationId, use.conditionId, use.reason, use.effectivenessRating]);
          }

          setTimeout(() => {
            for (const link of seeds.researchLinks) {
              db.run('INSERT OR IGNORE INTO researchLinks (sourceType, title, url, year, medicationId, conditionId) VALUES (?, ?, ?, ?, ?, ?)',
                [link.sourceType, link.title, link.url, link.year, link.medicationId, link.conditionId]);
            }
            resolve();
          }, 500);
        }, 500);
      } catch (err) {
        reject(err);
      }
    });
  });
};

const runAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

const runOneAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

app.get('/api/medications', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    let sql = 'SELECT * FROM medications WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR genericName LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY name LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const medications = await runAsync(sql, params);
    const total = await runOneAsync(
      'SELECT COUNT(*) as count FROM medications WHERE name LIKE ? OR genericName LIKE ?',
      [search ? `%${search}%` : '%', search ? `%${search}%` : '%']
    );

    res.json({ medications, total: total.count, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/medications/:id', async (req, res) => {
  try {
    const med = await runOneAsync('SELECT * FROM medications WHERE id = ?', [req.params.id]);
    if (!med) return res.status(404).json({ error: 'Medication not found' });

    const uses = await runAsync(`
      SELECT c.*, mu.reason, mu.effectivenessRating FROM medicationUses mu
      JOIN conditions c ON mu.conditionId = c.id
      WHERE mu.medicationId = ?
    `, [req.params.id]);

    const research = await runAsync('SELECT * FROM researchLinks WHERE medicationId = ?', [req.params.id]);

    res.json({ ...med, conditions: uses, research });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/conditions', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;
    let sql = 'SELECT * FROM conditions WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY name LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const conditions = await runAsync(sql, params);
    const total = await runOneAsync('SELECT COUNT(*) as count FROM conditions');

    res.json({ conditions, total: total.count, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/conditions/:id', async (req, res) => {
  try {
    const cond = await runOneAsync('SELECT * FROM conditions WHERE id = ?', [req.params.id]);
    if (!cond) return res.status(404).json({ error: 'Condition not found' });

    const medications = await runAsync(`
      SELECT m.*, mu.reason, mu.effectivenessRating FROM medicationUses mu
      JOIN medications m ON mu.medicationId = m.id
      WHERE mu.conditionId = ?
    `, [req.params.id]);

    const research = await runAsync('SELECT * FROM researchLinks WHERE conditionId = ?', [req.params.id]);

    res.json({ ...cond, medications, research });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ medications: [], conditions: [] });

    const searchTerm = `%${q}%`;
    const medications = await runAsync(
      'SELECT * FROM medications WHERE name LIKE ? OR genericName LIKE ? LIMIT 5',
      [searchTerm, searchTerm]
    );
    const conditions = await runAsync(
      'SELECT * FROM conditions WHERE name LIKE ? LIMIT 5',
      [searchTerm]
    );

    res.json({ medications, conditions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const medCategories = await runAsync('SELECT DISTINCT category FROM medications ORDER BY category');
    const condCategories = await runAsync('SELECT DISTINCT category FROM conditions ORDER BY category');
    res.json({ medicationCategories: medCategories.map(m => m.category), conditionCategories: condCategories.map(c => c.category) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

initDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('Database initialization failed:', err));
