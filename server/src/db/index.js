const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'waste2market.db');
const schemaPath = path.join(__dirname, 'schema.sql');

// Initialize database
const db = new DatabaseSync(dbPath);

// Enable foreign keys and WAL mode for reliability
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

// Initialize tables if needed
const schemaSql = fs.readFileSync(schemaPath, 'utf8');
db.exec(schemaSql);

/**
 * Execute a query returning multiple rows
 * @param {string} sql 
 * @param {Array} params 
 * @returns {Array}
 */
function query(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.all(...params);
}

/**
 * Execute a query returning a single row
 * @param {string} sql 
 * @param {Array} params 
 * @returns {Object|undefined}
 */
function get(sql, params = []) {
  const stmt = db.prepare(sql);
  return stmt.get(...params);
}

/**
 * Execute an INSERT / UPDATE / DELETE statement
 * @param {string} sql 
 * @param {Array} params 
 * @returns {{ changes: number, lastInsertRowid: number|bigint }}
 */
function run(sql, params = []) {
  const stmt = db.prepare(sql);
  const result = stmt.run(...params);
  return {
    changes: result.changes,
    lastInsertRowid: Number(result.lastInsertRowid)
  };
}

/**
 * Execute raw multi-statement SQL
 * @param {string} sql 
 */
function exec(sql) {
  return db.exec(sql);
}

module.exports = {
  db,
  query,
  get,
  run,
  exec
};
