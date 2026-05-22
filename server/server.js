import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

let db;

const initDB = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(path.join(__dirname, 'db', 'medications.db'), async (err) => {
      if (err) return reject(err);

      db.run('PRAGMA foreign_keys = ON');

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
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      for (const med of seeds.medications) {
        db.run('INSERT OR IGNORE INTO medications (name, genericName, category, description) VALUES (?, ?, ?, ?)',
          [med.name, med.genericName, med.category, med.description]);
      }
      for (const cond of seeds.conditions) {
        db.run('INSERT OR IGNORE INTO conditions (name, category, description, symptoms) VALUES (?, ?, ?, ?)',
          [cond.name, cond.category, cond.description, cond.symptoms]);
      }
      for (const use of seeds.medicationUses) {
        db.run('INSERT OR IGNORE INTO medicationUses (medicationId, conditionId, reason, effectivenessRating) VALUES (?, ?, ?, ?)',
          [use.medicationId, use.conditionId, use.reason, use.effectivenessRating]);
      }
      for (const link of seeds.researchLinks) {
        db.run('INSERT OR IGNORE INTO researchLinks (sourceType, title, url, year, medicationId, conditionId) VALUES (?, ?, ?, ?, ?, ?)',
          [link.sourceType, link.title, link.url, link.year, link.medicationId, link.conditionId]);
      }

      db.run('COMMIT', (err) => {
        if (err) {
          db.run('ROLLBACK', () => reject(err));
        } else {
          resolve();
        }
      });
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

const parsePagination = (rawPage, rawLimit) => {
  const page = Math.max(1, parseInt(rawPage) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(rawLimit) || 10));
  return { page, limit };
};

app.get('/api/medications', async (req, res) => {
  try {
    const { search, category } = req.query;
    const { page, limit } = parsePagination(req.query.page, req.query.limit);
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
    params.push(limit, (page - 1) * limit);

    const medications = await runAsync(sql, params);

    let countSql = 'SELECT COUNT(*) as count FROM medications WHERE 1=1';
    const countParams = [];
    if (search) {
      countSql += ' AND (name LIKE ? OR genericName LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    if (category) {
      countSql += ' AND category = ?';
      countParams.push(category);
    }
    const total = await runOneAsync(countSql, countParams);

    res.json({ medications, total: total.count, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
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
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/conditions', async (req, res) => {
  try {
    const { search, category } = req.query;
    const { page, limit } = parsePagination(req.query.page, req.query.limit);
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
    params.push(limit, (page - 1) * limit);

    const conditions = await runAsync(sql, params);

    let countSql = 'SELECT COUNT(*) as count FROM conditions WHERE 1=1';
    const countParams = [];
    if (search) {
      countSql += ' AND (name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }
    if (category) {
      countSql += ' AND category = ?';
      countParams.push(category);
    }
    const total = await runOneAsync(countSql, countParams);

    res.json({ conditions, total: total.count, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
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
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
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
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const medCategories = await runAsync('SELECT DISTINCT category FROM medications ORDER BY category');
    const condCategories = await runAsync('SELECT DISTINCT category FROM conditions ORDER BY category');
    res.json({ medicationCategories: medCategories.map(m => m.category), conditionCategories: condCategories.map(c => c.category) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

initDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('Database initialization failed:', err));
