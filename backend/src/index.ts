import express from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── DATABASE CONNECTION ─────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  max: 5,
  idleTimeoutMillis: 30000,
});

// ─── SEED DATA ───────────────────────────────────────────────────────
const collegesData = [
  ["IIT Bombay", "Mumbai", "Maharashtra", 250000, 4.9, "{B.Tech,M.Tech,MBA,PhD}", 98, 24.5, "Google", 1958, "Public", "Top institute", "https://images.unsplash.com/photo-1562774053-701939374585?w=800"],
  ["IIT Delhi", "New Delhi", "Delhi", 230000, 4.8, "{B.Tech,M.Tech,MBA,PhD}", 97, 22.3, "Microsoft", 1961, "Public", "Top IIT", "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800"],
  ["BITS Pilani", "Pilani", "Rajasthan", 550000, 4.7, "{B.Tech,M.Tech,MBA}", 95, 18.5, "Amazon", 1964, "Private", "Premier institute", "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800"],
  ["NIT Trichy", "Tiruchirappalli", "Tamil Nadu", 145000, 4.5, "{B.Tech,M.Tech,MCA}", 92, 14.2, "TCS", 1964, "Public", "Top NIT", "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800"],
  ["VIT Vellore", "Vellore", "Tamil Nadu", 200000, 4.2, "{B.Tech,M.Tech,MBA,MCA}", 90, 12.8, "Wipro", 1984, "Private", "Private university", "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800"],
];

// ─── INIT DB ─────────────────────────────────────────────────────────
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS colleges (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        location VARCHAR(255),
        state VARCHAR(100),
        fees_per_year INTEGER,
        rating DECIMAL(3,1),
        courses TEXT[],
        placement_percentage INTEGER,
        avg_package_lpa DECIMAL(5,2),
        top_recruiter VARCHAR(255),
        established INTEGER,
        type VARCHAR(50),
        description TEXT,
        image_url TEXT
      );
    `);

    let count = 0;

    try {
      const result = await pool.query("SELECT COUNT(*) FROM colleges");
      count = parseInt(result.rows[0].count);
    } catch (err) {
      console.log("Table check failed (safe on first deploy)");
    }

    if (count === 0) {
      await seedColleges();
      console.log("🌱 Database seeded");
    }
  } catch (err) {
    console.error("❌ initDB error:", err);
  }
}

// ─── SEED FUNCTION ───────────────────────────────────────────────────
async function seedColleges() {
  try {
    for (const c of collegesData) {
      await pool.query(
        `INSERT INTO colleges
        (name, location, state, fees_per_year, rating, courses, placement_percentage, avg_package_lpa, top_recruiter, established, type, description, image_url)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        ON CONFLICT DO NOTHING`,
        c
      );
    }
    console.log("🌱 Seeding complete");
  } catch (err) {
    console.error("❌ Seed error:", err);
  }
}

// ─── ROUTES ──────────────────────────────────────────────────────────

// ROOT
app.get("/", (_req, res) => {
  res.json({
    message: "College Discovery API is running 🚀",
    endpoints: ["/health", "/colleges", "/compare", "/states"],
  });
});

// HEALTH
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// COLLEGES
app.get("/colleges", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM colleges ORDER BY rating DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// SINGLE COLLEGE
app.get("/colleges/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM colleges WHERE id = $1",
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "College not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// COMPARE
app.get("/compare", async (req, res) => {
  try {
    const { ids } = req.query;

    if (!ids) {
      return res.status(400).json({ error: "Provide college ids" });
    }

    const idArray = (ids as string)
      .split(",")
      .map(Number)
      .filter(Boolean);

    const result = await pool.query(
      "SELECT * FROM colleges WHERE id = ANY($1)",
      [idArray]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// STATES
app.get("/states", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT DISTINCT state FROM colleges ORDER BY state"
    );

    res.json(result.rows.map((r) => r.state));
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ─── START SERVER ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;

async function startServer() {
  await initDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();