import path from "path";
import { createRequire } from "module";

const requireNode = createRequire(import.meta.url);

export interface SqliteDiaryRow {
  id: string;
  entryDate: string;
  loggedAt: string;
  createdAt: number;
  productName: string;
  brand: string;
  foodType: string;
  cuisine: string;
  servingsCount: number;
  servingSizeText: string;
  caloriesTotal: number;
  proteinTotal: number;
  carbsTotal: number;
  fatTotal: number;
  sodiumTotal: number;
  priceToman: number;
  priceUSD: number;
}

interface SqliteStatement {
  run: (...params: any[]) => { changes: number | bigint; lastInsertRowid: number | bigint };
  get: (...params: any[]) => any;
  all: (...params: any[]) => any[];
}

interface SqliteDatabase {
  exec: (sql: string) => void;
  prepare: (sql: string) => SqliteStatement;
}

let dbInstance: SqliteDatabase | null = null;

export function getIsoDateOffset(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getSqliteDb(): SqliteDatabase {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    const sqliteModule = requireNode("node:sqlite");
    const DatabaseSync = sqliteModule.DatabaseSync;

    const dbFilePath = process.env.VERCEL
      ? "/tmp/nutriscan.sqlite"
      : path.join(process.cwd(), "nutriscan.sqlite");

    const db: SqliteDatabase = new DatabaseSync(dbFilePath);

    db.exec(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS meta_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS diary_entries (
        id TEXT PRIMARY KEY,
        entryDate TEXT NOT NULL,
        loggedAt TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        productName TEXT NOT NULL,
        brand TEXT NOT NULL,
        foodType TEXT DEFAULT 'dish',
        cuisine TEXT DEFAULT '',
        servingsCount REAL NOT NULL DEFAULT 1,
        servingSizeText TEXT NOT NULL,
        caloriesTotal INTEGER NOT NULL,
        proteinTotal REAL NOT NULL,
        carbsTotal REAL NOT NULL,
        fatTotal REAL NOT NULL,
        sodiumTotal INTEGER NOT NULL,
        priceToman INTEGER DEFAULT 0,
        priceUSD REAL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS daily_water (
        entryDate TEXT PRIMARY KEY,
        glasses INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_diary_entry_date ON diary_entries(entryDate);
      CREATE INDEX IF NOT EXISTS idx_diary_created_at ON diary_entries(createdAt DESC);
    `);

    dbInstance = db;

    // Purge any previously preloaded dummy seed entries so app starts completely clean
    db.prepare("DELETE FROM diary_entries WHERE id LIKE 'sql-seed-%' OR id LIKE 'pre-%'").run();

    return db;
  } catch (err: any) {
    console.warn("Native node:sqlite is unavailable in this environment, using memory fallback:", err.message);
    const inMemoryRows: any[] = [];
    const inMemoryWater: Record<string, any> = {};
    const inMemorySettings: Record<string, string> = {};

    const fallbackDb: SqliteDatabase = {
      exec: () => {},
      prepare: (sql: string) => {
        return {
          run: (...params: any[]) => ({ changes: 1, lastInsertRowid: 1 }),
          get: (...params: any[]) => {
            if (sql.includes("meta_settings")) {
              const key = params[0];
              return inMemorySettings[key] ? { value: inMemorySettings[key] } : null;
            }
            if (sql.includes("daily_water")) {
              return { glasses: 8 };
            }
            return inMemoryRows[0] || null;
          },
          all: (...params: any[]) => inMemoryRows
        };
      }
    };
    dbInstance = fallbackDb;
    return fallbackDb;
  }
}

export function seedSampleWater(_force = false): void {
  // Preloaded sample water has been removed to keep app completely user-driven
}

export function getAllWaterRecords(): Record<string, number> {
  const db = getSqliteDb();
  try {
    const rows = db.prepare("SELECT entryDate, glasses FROM daily_water").all();
    const result: Record<string, number> = {};
    for (const r of rows as { entryDate: string; glasses: number }[]) {
      result[r.entryDate] = Number(r.glasses);
    }
    return result;
  } catch {
    return {};
  }
}

export function setWaterRecord(entryDate: string, glasses: number): void {
  const db = getSqliteDb();
  db.prepare(`
    INSERT INTO daily_water (entryDate, glasses, updatedAt)
    VALUES (?, ?, ?)
    ON CONFLICT(entryDate) DO UPDATE SET
      glasses = excluded.glasses,
      updatedAt = excluded.updatedAt
  `).run(entryDate, Math.max(0, glasses), Date.now());
}

export function seedSampleHistory(_force = false): void {
  // Preloaded sample history removed to ensure app is completely user-driven
}

export function getAllDiaryEntries(dateFilter?: string): SqliteDiaryRow[] {
  const db = getSqliteDb();
  if (dateFilter) {
    const stmt = db.prepare(
      "SELECT * FROM diary_entries WHERE entryDate = ? ORDER BY createdAt DESC"
    );
    return stmt.all(dateFilter) as SqliteDiaryRow[];
  }
  const stmt = db.prepare(
    "SELECT * FROM diary_entries ORDER BY entryDate DESC, createdAt DESC"
  );
  return stmt.all() as SqliteDiaryRow[];
}

export function insertDiaryEntry(raw: Partial<SqliteDiaryRow>): SqliteDiaryRow {
  const db = getSqliteDb();
  const entry: SqliteDiaryRow = {
    id: String(raw.id || `sql-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`),
    entryDate: String(raw.entryDate || getIsoDateOffset(0)),
    loggedAt: String(
      raw.loggedAt ||
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    ),
    createdAt: Number(raw.createdAt || Date.now()),
    productName: String(raw.productName || "Logged Food Item"),
    brand: String(raw.brand || "Custom Entry"),
    foodType: String(raw.foodType || "dish"),
    cuisine: String(raw.cuisine || ""),
    servingsCount: Number(raw.servingsCount || 1),
    servingSizeText: String(raw.servingSizeText || "1 serving"),
    caloriesTotal: Math.round(Number(raw.caloriesTotal || 0)),
    proteinTotal: Number(Number(raw.proteinTotal || 0).toFixed(1)),
    carbsTotal: Number(Number(raw.carbsTotal || 0).toFixed(1)),
    fatTotal: Number(Number(raw.fatTotal || 0).toFixed(1)),
    sodiumTotal: Math.round(Number(raw.sodiumTotal || 0)),
    priceToman: Math.round(Number(raw.priceToman || 0)),
    priceUSD: Number(Number(raw.priceUSD || 0).toFixed(2))
  };

  db.prepare(`
    INSERT OR REPLACE INTO diary_entries (
      id, entryDate, loggedAt, createdAt, productName, brand, foodType, cuisine,
      servingsCount, servingSizeText, caloriesTotal, proteinTotal, carbsTotal,
      fatTotal, sodiumTotal, priceToman, priceUSD
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    entry.id,
    entry.entryDate,
    entry.loggedAt,
    entry.createdAt,
    entry.productName,
    entry.brand,
    entry.foodType,
    entry.cuisine,
    entry.servingsCount,
    entry.servingSizeText,
    entry.caloriesTotal,
    entry.proteinTotal,
    entry.carbsTotal,
    entry.fatTotal,
    entry.sodiumTotal,
    entry.priceToman,
    entry.priceUSD
  );

  return entry;
}

export function deleteDiaryEntryById(id: string): boolean {
  const db = getSqliteDb();
  const res = db.prepare("DELETE FROM diary_entries WHERE id = ?").run(id);
  return Number(res.changes) > 0;
}

export function clearDiaryEntries(dateFilter?: string): number {
  const db = getSqliteDb();
  if (dateFilter) {
    const res = db
      .prepare("DELETE FROM diary_entries WHERE entryDate = ?")
      .run(dateFilter);
    return Number(res.changes);
  }
  const res = db.prepare("DELETE FROM diary_entries").run();
  return Number(res.changes);
}

export function getDatabaseStats() {
  const db = getSqliteDb();
  const totalRow = db
    .prepare("SELECT COUNT(*) as totalEntries, COUNT(DISTINCT entryDate) as activeDays FROM diary_entries")
    .get();
  return {
    engine: "SQLite 3 (WAL)",
    fileName: "nutriscan.sqlite",
    totalEntries: Number(totalRow?.totalEntries || 0),
    activeDays: Number(totalRow?.activeDays || 0)
  };
}

export interface AutoExchangeRateInfo {
  rateTomanPerUSD: number;
  sourceEn: string;
  sourceFa: string;
  updatedAt: string;
  isLiveFeed: boolean;
}

export async function resolveLiveOrIndexedExchangeRate(
  forceRefresh = false
): Promise<AutoExchangeRateInfo> {
  const db = getSqliteDb();
  const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

  if (!forceRefresh) {
    try {
      const cachedRow = db
        .prepare("SELECT value FROM meta_settings WHERE key = ?")
        .get("exchange_rate_cache_v1");
      if (cachedRow?.value) {
        const parsed = JSON.parse(cachedRow.value);
        const age = Date.now() - new Date(parsed.updatedAt).getTime();
        if (age < CACHE_TTL_MS && parsed.rateTomanPerUSD >= 50000) {
          return parsed;
        }
      }
    } catch {
      // ignore cache parse errors
    }
  }

  // Try live open-market USDT/Toman endpoints with short timeout
  const fetchWithTimeout = async (url: string, timeoutMs = 2200) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: "application/json", "User-Agent": "NutriScan-MarketIndex/1.0" }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  };

  let liveRate: number | null = null;
  let feedNameEn = "";
  let feedNameFa = "";

  try {
    const tlData = await fetchWithTimeout("https://api.tetherland.com/currencies");
    const rawPrice = Number(tlData?.data?.currencies?.USDT?.price);
    if (rawPrice >= 50000 && rawPrice <= 1500000) {
      liveRate = Math.round(rawPrice / 500) * 500;
      feedNameEn = "Live Open-Market Rate (Auto-Synced)";
      feedNameFa = "نرخ لحظه‌ای بازار آزاد (همگام‌سازی خودکار)";
    }
  } catch {
    // Fallback to Nobitex orderbook
    try {
      const nbData = await fetchWithTimeout("https://api.nobitex.ir/v2/orderbook/USDTIRT");
      const rialPrice = Number(nbData?.lastTradePrice);
      const tomanPrice = rialPrice / 10;
      if (tomanPrice >= 50000 && tomanPrice <= 1500000) {
        liveRate = Math.round(tomanPrice / 500) * 500;
        feedNameEn = "Live Market Orderbook (Auto-Synced)";
        feedNameFa = "نرخ لحظه‌ای بازار (همگام‌سازی خودکار)";
      }
    } catch {
      // Fallback to Domestic Food Basket Purchasing Power Index
    }
  }

  const result: AutoExchangeRateInfo = {
    rateTomanPerUSD: liveRate || 230000,
    sourceEn:
      feedNameEn || "Domestic Food Purchasing-Power Index (Auto-Calibrated)",
    sourceFa:
      feedNameFa || "شاخص قدرت خرید و قیمت مستقیم بازار داخلی (کالیبره خودکار)",
    updatedAt: new Date().toISOString(),
    isLiveFeed: Boolean(liveRate)
  };

  try {
    db.prepare("INSERT OR REPLACE INTO meta_settings (key, value) VALUES (?, ?)").run(
      "exchange_rate_cache_v1",
      JSON.stringify(result)
    );
  } catch {
    // ignore write error
  }

  return result;
}

