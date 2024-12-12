const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const readline = require('readline');
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = new sqlite3.Database('./flavors.db');

// === Database Setup ===
const setupDatabase = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS capabilities (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS flavors (
      id INTEGER PRIMARY KEY,
      category_id INTEGER,
      name TEXT,
      FOREIGN KEY(category_id) REFERENCES categories(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY,
      name TEXT,
      email TEXT,
      capability_id INTEGER,
      comments TEXT,
      FOREIGN KEY(capability_id) REFERENCES capabilities(id)
    )`);

    // Insert capabilities if not exist
    const capabilities = ['Design', 'Production', 'Certification'];
    capabilities.forEach((cap) => {
      db.run('INSERT OR IGNORE INTO capabilities (name) VALUES (?)', [cap]);
    });
  });
};

// === Import CSV for Categories/Flavors ===
const importCSV = (filePath) => {
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  const categoriesMap = new Map();

  rl.on('line', (line) => {
    const parts = line.split(',');
    if (parts.length < 3) return; // Skip malformed lines
    const [, rawCategory, rawFlavor] = parts;

    const category = rawCategory.trim().replace(/^"|"$/g, '');
    const flavor = rawFlavor.trim().replace(/^"|"$/g, '');

    if (!categoriesMap.has(category)) {
      db.run('INSERT OR IGNORE INTO categories (name) VALUES (?)', [category], function () {
        categoriesMap.set(category, this.lastID || categoriesMap.size + 1);
      });
    }

    rl.pause();
    const categoryId = categoriesMap.get(category);
    db.run('INSERT OR IGNORE INTO flavors (category_id, name) VALUES (?, ?)', [categoryId, flavor], (err) => {
      if (err) console.error('Error inserting flavor:', err.message);
      rl.resume();
    });
  });

  rl.on('close', () => {
    console.log('Data imported successfully.');
  });
};

// === API Routes ===
app.get('/api/capabilities', (req, res) => {
  db.all('SELECT * FROM capabilities', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/categories', (req, res) => {
  db.all('SELECT * FROM categories', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/categories/:id/flavors', (req, res) => {
  const categoryId = req.params.id;
  db.all('SELECT * FROM flavors WHERE category_id = ?', [categoryId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// === Quote Form Submission ===
app.post('/quotes', (req, res) => {
  const { name, email, capability, comments } = req.body;
  db.get('SELECT id FROM capabilities WHERE id = ?', [capability], (err, capRow) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!capRow) return res.status(400).json({ error: 'Invalid capability selected' });

    db.run(
      'INSERT INTO quotes (name, email, capability_id, comments) VALUES (?, ?, ?, ?)',
      [name, email, capability, comments],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Quote submitted successfully', quoteId: this.lastID });
      }
    );
  });
});

// === Frontend Routes ===
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/flavors', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'flavors.html'));
});

app.get('/flavors/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'category.html'));
});

app.get('/capabilities', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/capabilities/design', (req, res) => {
  res.redirect('/?slide=1');
});

app.get('/capabilities/production', (req, res) => {
  res.redirect('/?slide=2');
});

app.get('/capabilities/certification', (req, res) => {
  res.redirect('/?slide=3');
});

// Serve static files
app.use(express.static('public'));

// === Database Initialization ===
setupDatabase();
importCSV('./flavors.csv');

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Ensure "public" directory exists
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public');
}
