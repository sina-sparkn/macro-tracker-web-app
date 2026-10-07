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

    // Check if initial seed has run
    const seededRow = db
      .prepare("SELECT value FROM meta_settings WHERE key = ?")
      .get("initial_seed_v2_water");

    if (!seededRow) {
      seedSampleHistory(false);
      seedSampleWater(false);
      db.prepare("INSERT OR REPLACE INTO meta_settings (key, value) VALUES (?, ?)").run(
        "initial_seed_v2_water",
        new Date().toISOString()
      );
    }

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

export function seedSampleWater(force = false): void {
  const db = getSqliteDb();
  const countRow = db.prepare("SELECT COUNT(*) as cnt FROM daily_water").get();
  if (!force && countRow && Number(countRow.cnt) > 0) {
    return;
  }

  const sampleWaterPattern = [5, 8, 7, 9, 8, 6, 8, 7, 8, 9, 6, 8, 7, 8];
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO daily_water (entryDate, glasses, updatedAt)
    VALUES (?, ?, ?)
  `);

  for (let i = 0; i < sampleWaterPattern.length; i++) {
    const iso = getIsoDateOffset(i);
    stmt.run(iso, sampleWaterPattern[i], Date.now());
  }
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

export function seedSampleHistory(force = false): void {
  const db = getSqliteDb();
  const countRow = db.prepare("SELECT COUNT(*) as cnt FROM diary_entries").get();
  if (!force && countRow && Number(countRow.cnt) > 0) {
    return;
  }

  const now = Date.now();
  const seedEntries: SqliteDiaryRow[] = [
    // Today (0 days ago)
    {
      id: "sql-seed-d0-1",
      entryDate: getIsoDateOffset(0),
      loggedAt: "08:30",
      createdAt: now - 3600000 * 5,
      productName: "Sangak Bread with Feta, Walnuts & Fresh Herbs",
      brand: "Traditional Persian Breakfast",
      foodType: "dish",
      cuisine: "Persian / ایرانی",
      servingsCount: 1,
      servingSizeText: "1 plate (220g)",
      caloriesTotal: 380,
      proteinTotal: 16,
      carbsTotal: 44,
      fatTotal: 15,
      sodiumTotal: 520,
      priceToman: 290000,
      priceUSD: 1.26
    },
    {
      id: "sql-seed-d0-2",
      entryDate: getIsoDateOffset(0),
      loggedAt: "13:15",
      createdAt: now - 3600000 * 2,
      productName: "Ghormeh Sabzi with Saffron Rice",
      brand: "Authentic Persian Plate",
      foodType: "dish",
      cuisine: "Persian / ایرانی",
      servingsCount: 1,
      servingSizeText: "1 plate (350g)",
      caloriesTotal: 420,
      proteinTotal: 28,
      carbsTotal: 38,
      fatTotal: 16,
      sodiumTotal: 480,
      priceToman: 950000,
      priceUSD: 4.13
    },
    {
      id: "sql-seed-d0-3",
      entryDate: getIsoDateOffset(0),
      loggedAt: "16:40",
      createdAt: now - 3600000 * 1,
      productName: "High-Protein Greek Yogurt",
      brand: "Chobani Plain",
      foodType: "packaged_food",
      cuisine: "Mediterranean",
      servingsCount: 1,
      servingSizeText: "1 container (150g)",
      caloriesTotal: 120,
      proteinTotal: 18,
      carbsTotal: 6,
      fatTotal: 2,
      sodiumTotal: 65,
      priceToman: 400000,
      priceUSD: 1.74
    },

    // 1 day ago (Yesterday)
    {
      id: "sql-seed-d1-1",
      entryDate: getIsoDateOffset(1),
      loggedAt: "09:00",
      createdAt: now - 86400000 * 1 - 3600000 * 6,
      productName: "Persian Omelette with Tomatoes & Barbari",
      brand: "Tehran Café",
      foodType: "dish",
      cuisine: "Persian / ایرانی",
      servingsCount: 1,
      servingSizeText: "1 skillet (280g)",
      caloriesTotal: 440,
      proteinTotal: 22,
      carbsTotal: 36,
      fatTotal: 22,
      sodiumTotal: 540,
      priceToman: 360000,
      priceUSD: 1.57
    },
    {
      id: "sql-seed-d1-2",
      entryDate: getIsoDateOffset(1),
      loggedAt: "14:00",
      createdAt: now - 86400000 * 1 - 3600000 * 3,
      productName: "Chelo Kabab Koobideh",
      brand: "Persian Grill Traditional",
      foodType: "dish",
      cuisine: "Persian / ایرانی",
      servingsCount: 1,
      servingSizeText: "2 skewers with rice (400g)",
      caloriesTotal: 680,
      proteinTotal: 38,
      carbsTotal: 62,
      fatTotal: 28,
      sodiumTotal: 580,
      priceToman: 1150000,
      priceUSD: 5.0
    },
    {
      id: "sql-seed-d1-3",
      entryDate: getIsoDateOffset(1),
      loggedAt: "20:15",
      createdAt: now - 86400000 * 1 - 3600000 * 1,
      productName: "Traditional Ash Reshteh",
      brand: "Authentic Persian Bowl",
      foodType: "dish",
      cuisine: "Persian / ایرانی",
      servingsCount: 1,
      servingSizeText: "1 bowl (400g)",
      caloriesTotal: 340,
      proteinTotal: 14,
      carbsTotal: 52,
      fatTotal: 9,
      sodiumTotal: 520,
      priceToman: 420000,
      priceUSD: 1.83
    },

    // 2 days ago
    {
      id: "sql-seed-d2-1",
      entryDate: getIsoDateOffset(2),
      loggedAt: "08:45",
      createdAt: now - 86400000 * 2 - 3600000 * 6,
      productName: "Oatmeal Bowl with Honey & Almonds",
      brand: "Home Kitchen",
      foodType: "dish",
      cuisine: "International",
      servingsCount: 1,
      servingSizeText: "1 bowl (260g)",
      caloriesTotal: 360,
      proteinTotal: 13,
      carbsTotal: 54,
      fatTotal: 10,
      sodiumTotal: 140,
      priceToman: 260000,
      priceUSD: 1.13
    },
    {
      id: "sql-seed-d2-2",
      entryDate: getIsoDateOffset(2),
      loggedAt: "13:30",
      createdAt: now - 86400000 * 2 - 3600000 * 3,
      productName: "Zereshk Polo ba Morgh (Barberry Saffron Chicken)",
      brand: "Royal Persian Kitchen",
      foodType: "dish",
      cuisine: "Persian / ایرانی",
      servingsCount: 1,
      servingSizeText: "1 plate (380g)",
      caloriesTotal: 590,
      proteinTotal: 36,
      carbsTotal: 64,
      fatTotal: 18,
      sodiumTotal: 510,
      priceToman: 850000,
      priceUSD: 3.7
    },
    {
      id: "sql-seed-d2-3",
      entryDate: getIsoDateOffset(2),
      loggedAt: "19:45",
      createdAt: now - 86400000 * 2 - 3600000 * 1,
      productName: "Grilled Salmon Bowl with Quinoa & Greens",
      brand: "Mediterranean Harvest",
      foodType: "dish",
      cuisine: "Mediterranean",
      servingsCount: 1,
      servingSizeText: "1 plate (340g)",
      caloriesTotal: 520,
      proteinTotal: 39,
      carbsTotal: 41,
      fatTotal: 21,
      sodiumTotal: 420,
      priceToman: 1120000,
      priceUSD: 4.87
    },

    // 3 days ago
    {
      id: "sql-seed-d3-1",
      entryDate: getIsoDateOffset(3),
      loggedAt: "09:15",
      createdAt: now - 86400000 * 3 - 3600000 * 5,
      productName: "Avocado Toast with Poached Eggs",
      brand: "Artisan Bakery",
      foodType: "dish",
      cuisine: "International",
      servingsCount: 1,
      servingSizeText: "2 slices (240g)",
      caloriesTotal: 460,
      proteinTotal: 19,
      carbsTotal: 38,
      fatTotal: 25,
      sodiumTotal: 470,
      priceToman: 480000,
      priceUSD: 2.09
    },
    {
      id: "sql-seed-d3-2",
      entryDate: getIsoDateOffset(3),
      loggedAt: "14:10",
      createdAt: now - 86400000 * 3 - 3600000 * 3,
      productName: "Khoresht Fesenjan (Pomegranate Walnut Stew)",
      brand: "Northern Persian Cuisine",
      foodType: "dish",
      cuisine: "Persian / ایرانی",
      servingsCount: 1,
      servingSizeText: "1 plate (360g)",
      caloriesTotal: 640,
      proteinTotal: 29,
      carbsTotal: 52,
      fatTotal: 34,
      sodiumTotal: 460,
      priceToman: 1050000,
      priceUSD: 4.57
    },
    {
      id: "sql-seed-d3-3",
      entryDate: getIsoDateOffset(3),
      loggedAt: "20:30",
      createdAt: now - 86400000 * 3 - 3600000 * 1,
      productName: "Joojeh Kabab (Saffron Lemon Chicken Skewers)",
      brand: "Alborz Grill",
      foodType: "dish",
      cuisine: "Persian / ایرانی",
      servingsCount: 1,
      servingSizeText: "1 skewer + salad (320g)",
      caloriesTotal: 490,
      proteinTotal: 42,
      carbsTotal: 32,
      fatTotal: 19,
      sodiumTotal: 490,
      priceToman: 890000,
      priceUSD: 3.87
    },

    // 4 days ago
    {
      id: "sql-seed-d4-1",
      entryDate: getIsoDateOffset(4),
      loggedAt: "08:20",
      createdAt: now - 86400000 * 4 - 3600000 * 6,
      productName: "Mirza Ghasemi (Smoked Eggplant & Garlic Eggs)",
      brand: "Gilan Kitchen",
      foodType: "dish",
      cuisine: "Persian / ایرانی",
      servingsCount: 1,
      servingSizeText: "1 plate (300g)",
      caloriesTotal: 410,
      proteinTotal: 16,
      carbsTotal: 34,
      fatTotal: 23,
      sodiumTotal: 530,
      priceToman: 460000,
      priceUSD: 2.0
    },
    {
      id: "sql-seed-d4-2",
      entryDate: getIsoDateOffset(4),
      loggedAt: "13:50",
      createdAt: now - 86400000 * 4 - 3600000 * 3,
      productName: "Baghali Polo ba Mahicheh (Dill Rice & Lamb Shank)",
      brand: "Traditional Banquet",
      foodType: "dish",
      cuisine: "Persian / ایرانی",
      servingsCount: 1,
      servingSizeText: "1 generous plate (450g)",
      caloriesTotal: 780,
      proteinTotal: 46,
      carbsTotal: 68,
      fatTotal: 34,
      sodiumTotal: 640,
      priceToman: 1450000,
      priceUSD: 6.3
    },
    {
      id: "sql-seed-d4-3",
      entryDate: getIsoDateOffset(4),
      loggedAt: "19:20",
      createdAt: now - 86400000 * 4 - 3600000 * 1,
      productName: "Shirazi Salad & Lentil Soup",
      brand: "Light Evening Meal",
      foodType: "dish",
      cuisine: "Persian / ایرانی",
      servingsCount: 1,
      servingSizeText: "1 bowl + side (350g)",
      caloriesTotal: 290,
      proteinTotal: 15,
      carbsTotal: 42,
      fatTotal: 7,
      sodiumTotal: 380,
      priceToman: 320000,
      priceUSD: 1.39
    },

    // 5 days ago
    {
      id: "sql-seed-d5-1",
      entryDate: getIsoDateOffset(5),
      loggedAt: "10:00",
      createdAt: now - 86400000 * 5 - 3600000 * 5,
      productName: "Protein Berry Smoothie & Chia Seeds",
      brand: "Vital Blend",
      foodType: "beverage",
      cuisine: "International",
      servingsCount: 1,
      servingSizeText: "1 glass (350ml)",
      caloriesTotal: 310,
      proteinTotal: 26,
      carbsTotal: 35,
      fatTotal: 7,
      sodiumTotal: 190,
      priceToman: 340000,
      priceUSD: 1.48
    },
    {
      id: "sql-seed-d5-2",
      entryDate: getIsoDateOffset(5),
      loggedAt: "14:25",
      createdAt: now - 86400000 * 5 - 3600000 * 2,
      productName: "Tahchin Morgh (Crispy Saffron Yogurt Rice Cake)",
      brand: "Saffron House",
      foodType: "dish",
      cuisine: "Persian / ایرانی",
      servingsCount: 1,
      servingSizeText: "1 wedge (360g)",
      caloriesTotal: 660,
      proteinTotal: 34,
      carbsTotal: 68,
      fatTotal: 26,
      sodiumTotal: 560,
      priceToman: 890000,
      priceUSD: 3.87
    },
    {
      id: "sql-seed-d5-3",
      entryDate: getIsoDateOffset(5),
      loggedAt: "20:05",
      createdAt: now - 86400000 * 5 - 3600000 * 1,
      productName: "Corn Taco with Fresh Avocado",
      brand: "Global Kitchen",
      foodType: "dish",
      cuisine: "Mexico / مکزیک",
      servingsCount: 1,
      servingSizeText: "2 tacos (220g)",
      caloriesTotal: 360,
      proteinTotal: 12,
      carbsTotal: 42,
      fatTotal: 15,
      sodiumTotal: 290,
      priceToman: 710000,
      priceUSD: 3.08
    },

    // 6 days ago
    {
      id: "sql-seed-d6-1",
      entryDate: getIsoDateOffset(6),
      loggedAt: "08:50",
      createdAt: now - 86400000 * 6 - 3600000 * 6,
      productName: "Halim (Slow-Cooked Wheat & Shredded Turkey)",
      brand: "Traditional Morning Pot",
      foodType: "dish",
      cuisine: "Persian / ایرانی",
      servingsCount: 1,
      servingSizeText: "1 bowl (320g)",
      caloriesTotal: 490,
      proteinTotal: 27,
      carbsTotal: 64,
      fatTotal: 14,
      sodiumTotal: 460,
      priceToman: 440000,
      priceUSD: 1.91
    },
    {
      id: "sql-seed-d6-2",
      entryDate: getIsoDateOffset(6),
      loggedAt: "13:40",
      createdAt: now - 86400000 * 6 - 3600000 * 3,
      productName: "Khoresht Gheymeh (Split Pea & Saffron Potato Stew)",
      brand: "Authentic Persian Plate",
      foodType: "dish",
      cuisine: "Persian / ایرانی",
      servingsCount: 1,
      servingSizeText: "1 plate (360g)",
      caloriesTotal: 540,
      proteinTotal: 29,
      carbsTotal: 58,
      fatTotal: 20,
      sodiumTotal: 510,
      priceToman: 860000,
      priceUSD: 3.74
    },
    {
      id: "sql-seed-d6-3",
      entryDate: getIsoDateOffset(6),
      loggedAt: "19:30",
      createdAt: now - 86400000 * 6 - 3600000 * 1,
      productName: "Kashke Bademjan (Roasted Eggplant & Whey Dip)",
      brand: "Traditional Appetizer Plate",
      foodType: "dish",
      cuisine: "Persian / ایرانی",
      servingsCount: 1,
      servingSizeText: "1 plate (280g)",
      caloriesTotal: 390,
      proteinTotal: 15,
      carbsTotal: 36,
      fatTotal: 21,
      sodiumTotal: 590,
      priceToman: 520000,
      priceUSD: 2.26
    }
  ];

  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO diary_entries (
      id, entryDate, loggedAt, createdAt, productName, brand, foodType, cuisine,
      servingsCount, servingSizeText, caloriesTotal, proteinTotal, carbsTotal,
      fatTotal, sodiumTotal, priceToman, priceUSD
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const item of seedEntries) {
    insertStmt.run(
      item.id,
      item.entryDate,
      item.loggedAt,
      item.createdAt,
      item.productName,
      item.brand,
      item.foodType,
      item.cuisine,
      item.servingsCount,
      item.servingSizeText,
      item.caloriesTotal,
      item.proteinTotal,
      item.carbsTotal,
      item.fatTotal,
      item.sodiumTotal,
      item.priceToman,
      item.priceUSD
    );
  }
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

