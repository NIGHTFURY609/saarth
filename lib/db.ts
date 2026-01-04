import Database from 'better-sqlite3';

const db = new Database('saarthi.db');

// 1. Init Database with FTS5 for fast searching
export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      state TEXT,
      official_url TEXT NOT NULL,
      keywords TEXT -- For FTS
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS services_fts USING fts5(name, description, keywords);
  `);

  // 2. Check if empty, then seed (Demo Data)
  const count = db.prepare('SELECT count(*) as count FROM services').get() as { count: number };
  
  if (count.count === 0) {
    console.log("Seeding Database...");
    const stmt = db.prepare(`
      INSERT INTO services (name, description, state, official_url, keywords) 
      VALUES (?, ?, ?, ?, ?)
    `);

    const ftsStmt = db.prepare(`
      INSERT INTO services_fts (name, description, keywords) 
      VALUES (?, ?, ?)
    `);

    // DEMO DATA: Add 2 distinct services
    const seeds = [
      {
        name: "Learner's Driving License Application",
        desc: "Apply for a new learner's license in Kerala via Sarathi Parivahan.",
        state: "Kerala",
        url: "https://sarathi.parivahan.gov.in/sarathiservice/stateSelection.do",
        keywords: "driving license learner rto transport vehicle car bike"
      },
      {
        name: "Birth Certificate Registration",
        desc: "Register a birth or apply for a certificate in Delhi MCD.",
        state: "Delhi",
        url: "https://mcdonline.nic.in/rb/birth/index",
        keywords: "birth certificate mcd baby registration municipal"
      }
    ];

    seeds.forEach(s => {
      stmt.run(s.name, s.desc, s.state, s.url, s.keywords);
      ftsStmt.run(s.name, s.desc, s.keywords);
    });
  }
}

export default db;