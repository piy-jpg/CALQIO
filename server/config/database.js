import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { Pool } = pg;

let pool = null;
let isMock = false;

// In-memory fallback store when PostgreSQL server is offline
const memoryStore = {
  users: [],
  user_settings: [],
  categories: [],
  domains: [],
  calculators: [],
  favorites: [],
  calculation_history: [],
  recently_used: [],
  search_history: [],
  analytics_events: [],
  admin_users: [],
  _autoIds: {
    users: 1,
    categories: 1,
    domains: 1,
    calculators: 1,
    favorites: 1,
    calculation_history: 1,
    recently_used: 1,
    search_history: 1,
    analytics_events: 1,
    admin_users: 1
  }
};

/**
 * Initialize Database Connection
 */
export async function initDatabase() {
  const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/calqio';

  try {
    pool = new Pool({
      connectionString,
      connectionTimeoutMillis: 2000,
      idleTimeoutMillis: 10000,
      max: 10
    });

    // Test connection
    const client = await pool.connect();
    console.log(' [DB] Connected to PostgreSQL successfully.');
    
    // Run schema migrations
    const schemaPath = path.join(__dirname, '../migrations/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSql);
      console.log(' [DB] Schema migrations applied successfully.');
    }
    client.release();
    isMock = false;
  } catch (err) {
    console.warn(' [DB] PostgreSQL not reachable at ' + connectionString + '. Falling back to in-memory store.');
    console.warn('      Error was: ' + err.message);
    isMock = true;
  }
}

/**
 * Parameterized Query Helper
 */
export async function query(text, params = []) {
  if (!isMock && pool) {
    try {
      return await pool.query(text, params);
    } catch (err) {
      // If pool connection fails during operation, fallback
      console.error('[DB Query Error]', err.message);
      throw err;
    }
  }

  // Resilient In-Memory Query Engine for Fallback/Testing
  return executeMockQuery(text, params);
}

/**
 * Minimal In-Memory SQL Simulator for zero-friction fallback
 */
function executeMockQuery(sql, params = []) {
  const cleanSql = sql.trim().replace(/\s+/g, ' ');
  const upper = cleanSql.toUpperCase();

  // 1. SELECT queries
  if (upper.startsWith('SELECT')) {
    // Determine target table
    const fromMatch = cleanSql.match(/FROM\s+([a-zA-Z0-9_]+)/i);
    const table = fromMatch ? fromMatch[1].toLowerCase() : null;

    if (!table || !memoryStore[table]) {
      // Special queries like SELECT NOW() or SELECT 1
      if (cleanSql.includes('NOW()') || cleanSql.includes('1')) {
        return { rows: [{ '?column?': 1, now: new Date().toISOString() }], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    }

    let rows = [...memoryStore[table]];

    // Basic WHERE matching for single or compound conditions
    if (/WHERE/i.test(cleanSql)) {
      if (/email\s*=\s*\$1/i.test(cleanSql)) {
        rows = rows.filter(r => r.email?.toLowerCase() === params[0]?.toLowerCase());
      } else if (/id\s*=\s*\$1/i.test(cleanSql) && !/user_id/i.test(cleanSql)) {
        rows = rows.filter(r => r.id === Number(params[0]) || r.id === params[0]);
      } else if (/slug\s*=\s*\$1/i.test(cleanSql) && !/category_slug/i.test(cleanSql)) {
        rows = rows.filter(r => r.slug === params[0]);
      } else if (/user_id\s*=\s*\$1/i.test(cleanSql)) {
        rows = rows.filter(r => r.user_id === Number(params[0]) || r.user_id === params[0]);
        if (/calculator_slug\s*=\s*\$2/i.test(cleanSql)) {
          rows = rows.filter(r => r.calculator_slug === params[1]);
        }
      } else if (/category_slug\s*=\s*\$1/i.test(cleanSql)) {
        rows = rows.filter(r => r.category_slug === params[0]);
      } else if (/is_active\s*=\s*true/i.test(cleanSql)) {
        rows = rows.filter(r => r.is_active !== false);
      }
    }

    // ORDER BY
    if (/ORDER BY\s+([a-zA-Z0-9_]+)\s+DESC/i.test(cleanSql)) {
      const col = cleanSql.match(/ORDER BY\s+([a-zA-Z0-9_]+)\s+DESC/i)[1].toLowerCase();
      rows.sort((a, b) => (b[col] > a[col] ? 1 : -1));
    } else if (/ORDER BY\s+([a-zA-Z0-9_]+)/i.test(cleanSql)) {
      const col = cleanSql.match(/ORDER BY\s+([a-zA-Z0-9_]+)/i)[1].toLowerCase();
      rows.sort((a, b) => (a[col] > b[col] ? 1 : -1));
    }

    // LIMIT
    const limitMatch = cleanSql.match(/LIMIT\s+(\d+|\$\d+)/i);
    if (limitMatch) {
      const limitVal = limitMatch[1].startsWith('$') ? Number(params[Number(limitMatch[1].slice(1)) - 1]) : Number(limitMatch[1]);
      if (!isNaN(limitVal)) rows = rows.slice(0, limitVal);
    }

    return { rows, rowCount: rows.length };
  }

  // 2. INSERT queries
  if (upper.startsWith('INSERT INTO')) {
    const tableMatch = cleanSql.match(/INSERT INTO\s+([a-zA-Z0-9_]+)/i);
    const table = tableMatch ? tableMatch[1].toLowerCase() : null;

    if (table && memoryStore[table]) {
      const newId = memoryStore._autoIds[table]++;
      const newRecord = { id: newId, created_at: new Date().toISOString() };

      // Map parameters based on table structure
      if (table === 'users') {
        newRecord.email = params[0];
        newRecord.password_hash = params[1];
        newRecord.name = params[2];
        newRecord.avatar = params[3] || '';
        newRecord.role = params[4] || 'user';
        memoryStore.users.push(newRecord);
        return { rows: [newRecord], rowCount: 1 };
      } else if (table === 'user_settings') {
        newRecord.user_id = Number(params[0]);
        newRecord.currency = params[1] || '₹';
        newRecord.decimals = params[2] ?? 2;
        newRecord.history_retention = params[3] ?? true;
        newRecord.sound_effects = params[4] ?? false;
        newRecord.theme = params[5] || 'light';
        newRecord.updated_at = new Date().toISOString();
        memoryStore.user_settings = memoryStore.user_settings.filter(s => s.user_id !== newRecord.user_id);
        memoryStore.user_settings.push(newRecord);
        return { rows: [newRecord], rowCount: 1 };
      } else if (table === 'favorites') {
        newRecord.user_id = Number(params[0]);
        newRecord.calculator_slug = params[1];
        const exists = memoryStore.favorites.find(f => f.user_id === newRecord.user_id && f.calculator_slug === newRecord.calculator_slug);
        if (!exists) memoryStore.favorites.push(newRecord);
        return { rows: [newRecord], rowCount: 1 };
      } else if (table === 'calculation_history') {
        newRecord.user_id = Number(params[0]);
        newRecord.calculator_slug = params[1];
        newRecord.calc_name = params[2];
        newRecord.expression = params[3];
        newRecord.result = params[4];
        newRecord.inputs_json = typeof params[5] === 'string' ? JSON.parse(params[5] || '{}') : params[5] || {};
        memoryStore.calculation_history.unshift(newRecord);
        return { rows: [newRecord], rowCount: 1 };
      } else if (table === 'categories') {
        newRecord.slug = params[0];
        newRecord.name = params[1];
        newRecord.icon = params[2];
        newRecord.description = params[3];
        newRecord.sort_order = params[4] || 0;
        memoryStore.categories.push(newRecord);
        return { rows: [newRecord], rowCount: 1 };
      } else if (table === 'domains') {
        newRecord.slug = params[0];
        newRecord.category_slug = params[1];
        newRecord.name = params[2];
        newRecord.icon = params[3];
        newRecord.description = params[4];
        newRecord.sort_order = params[5] || 0;
        memoryStore.domains.push(newRecord);
        return { rows: [newRecord], rowCount: 1 };
      } else if (table === 'calculators') {
        newRecord.slug = params[0];
        newRecord.category_slug = params[1];
        newRecord.domain_slug = params[2];
        newRecord.name = params[3];
        newRecord.description = params[4];
        newRecord.icon = params[5];
        newRecord.tags = params[6] || [];
        newRecord.popular_score = params[7] || 0;
        newRecord.is_active = true;
        memoryStore.calculators.push(newRecord);
        return { rows: [newRecord], rowCount: 1 };
      } else if (table === 'recently_used') {
        newRecord.user_id = Number(params[0]);
        newRecord.calculator_slug = params[1];
        newRecord.last_used_at = new Date().toISOString();
        const existingIdx = memoryStore.recently_used.findIndex(r => r.user_id === newRecord.user_id && r.calculator_slug === newRecord.calculator_slug);
        if (existingIdx > -1) {
          memoryStore.recently_used[existingIdx].last_used_at = new Date().toISOString();
          memoryStore.recently_used[existingIdx].usage_count = (memoryStore.recently_used[existingIdx].usage_count || 1) + 1;
        } else {
          memoryStore.recently_used.unshift(newRecord);
        }
        return { rows: [newRecord], rowCount: 1 };
      } else if (table === 'analytics_events') {
        newRecord.user_id = params[0] ? Number(params[0]) : null;
        newRecord.event_type = params[1];
        newRecord.event_data = typeof params[2] === 'string' ? JSON.parse(params[2] || '{}') : params[2] || {};
        newRecord.ip_address = params[3];
        newRecord.user_agent = params[4];
        memoryStore.analytics_events.push(newRecord);
        return { rows: [newRecord], rowCount: 1 };
      }
    }
  }

  // 3. UPDATE queries
  if (upper.startsWith('UPDATE')) {
    const tableMatch = cleanSql.match(/UPDATE\s+([a-zA-Z0-9_]+)/i);
    const table = tableMatch ? tableMatch[1].toLowerCase() : null;

    if (table === 'user_settings') {
      const userId = Number(params[params.length - 1]);
      let setting = memoryStore.user_settings.find(s => s.user_id === userId);
      if (!setting) {
        setting = { user_id: userId, created_at: new Date().toISOString() };
        memoryStore.user_settings.push(setting);
      }
      if (params[0] !== undefined) setting.currency = params[0];
      if (params[1] !== undefined) setting.decimals = params[1];
      if (params[2] !== undefined) setting.history_retention = params[2];
      if (params[3] !== undefined) setting.sound_effects = params[3];
      if (params[4] !== undefined) setting.theme = params[4];
      setting.updated_at = new Date().toISOString();
      return { rows: [setting], rowCount: 1 };
    } else if (table === 'users') {
      const userId = Number(params[params.length - 1]);
      const user = memoryStore.users.find(u => u.id === userId);
      if (user) {
        if (/name\s*=\s*\$1/i.test(cleanSql)) user.name = params[0];
        if (/avatar\s*=\s*\$2/i.test(cleanSql)) user.avatar = params[1];
        user.updated_at = new Date().toISOString();
        return { rows: [user], rowCount: 1 };
      }
    }
  }

  // 4. DELETE queries
  if (upper.startsWith('DELETE FROM')) {
    const tableMatch = cleanSql.match(/DELETE FROM\s+([a-zA-Z0-9_]+)/i);
    const table = tableMatch ? tableMatch[1].toLowerCase() : null;

    if (table && memoryStore[table]) {
      if (table === 'favorites' && /user_id\s*=\s*\$1\s+AND\s+calculator_slug\s*=\s*\$2/i.test(cleanSql)) {
        const userId = Number(params[0]);
        const slug = params[1];
        memoryStore.favorites = memoryStore.favorites.filter(f => !(f.user_id === userId && f.calculator_slug === slug));
        return { rows: [], rowCount: 1 };
      } else if (table === 'calculation_history') {
        if (/id\s*=\s*\$1\s+AND\s+user_id\s*=\s*\$2/i.test(cleanSql)) {
          const id = Number(params[0]);
          const userId = Number(params[1]);
          memoryStore.calculation_history = memoryStore.calculation_history.filter(h => !(h.id === id && h.user_id === userId));
        } else if (/user_id\s*=\s*\$1/i.test(cleanSql)) {
          const userId = Number(params[0]);
          memoryStore.calculation_history = memoryStore.calculation_history.filter(h => h.user_id !== userId);
        }
        return { rows: [], rowCount: 1 };
      }
    }
  }

  return { rows: [], rowCount: 0 };
}

export const getStore = () => memoryStore;
export const isMockMode = () => isMock;
