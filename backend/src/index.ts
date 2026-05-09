import express from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ─── DB INIT ────────────────────────────────────────────────────────────────
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS colleges (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      state VARCHAR(100) NOT NULL,
      fees_per_year INTEGER NOT NULL,
      rating DECIMAL(3,1) NOT NULL,
      courses TEXT[] NOT NULL,
      placement_percentage INTEGER NOT NULL,
      avg_package_lpa DECIMAL(5,2) NOT NULL,
      top_recruiter VARCHAR(255),
      established INTEGER,
      type VARCHAR(50) DEFAULT 'Private',
      description TEXT,
      image_url TEXT
    );
  `);

  const { rows } = await pool.query("SELECT COUNT(*) FROM colleges");
  if (parseInt(rows[0].count) === 0) {
    await seedColleges();
  }
}

async function seedColleges() {
  const colleges = [
    ["IIT Bombay", "Mumbai", "Maharashtra", 250000, 4.9, "{B.Tech,M.Tech,MBA,PhD}", 98, 24.5, "Google", 1958, "Public", "Premier engineering institute and one of India's top technical universities.", "https://images.unsplash.com/photo-1562774053-701939374585?w=800"],
    ["IIT Delhi", "New Delhi", "Delhi", 230000, 4.8, "{B.Tech,M.Tech,MBA,PhD}", 97, 22.3, "Microsoft", 1961, "Public", "Top-ranked IIT known for research excellence and industry connect.", "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800"],
    ["BITS Pilani", "Pilani", "Rajasthan", 550000, 4.7, "{B.Tech,M.Tech,MBA}", 95, 18.5, "Amazon", 1964, "Private", "Pioneering private institute with industry-integrated education.", "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800"],
    ["NIT Trichy", "Tiruchirappalli", "Tamil Nadu", 145000, 4.5, "{B.Tech,M.Tech,MCA}", 92, 14.2, "TCS", 1964, "Public", "Premier NIT with strong placement record and research focus.", "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800"],
    ["VIT Vellore", "Vellore", "Tamil Nadu", 200000, 4.2, "{B.Tech,M.Tech,MBA,MCA}", 90, 12.8, "Wipro", 1984, "Private", "Large private university with global industry connections.", "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800"],
    ["IIIT Hyderabad", "Hyderabad", "Telangana", 300000, 4.6, "{B.Tech,M.Tech,PhD}", 96, 20.1, "Meta", 1998, "Public", "Specialized in IT and CS with cutting-edge research programs.", "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800"],
    ["Manipal Institute of Technology", "Manipal", "Karnataka", 400000, 4.1, "{B.Tech,M.Tech,MBA}", 85, 10.5, "Infosys", 1957, "Private", "One of India's oldest private engineering institutes.", "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800"],
    ["DTU Delhi", "New Delhi", "Delhi", 160000, 4.3, "{B.Tech,M.Tech,MBA,PhD}", 91, 15.6, "Samsung", 1941, "Public", "Delhi's top state university with excellent placement record.", "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800"],
    ["PSG College of Technology", "Coimbatore", "Tamil Nadu", 180000, 4.0, "{B.Tech,M.Tech,MBA}", 87, 11.2, "Cognizant", 1951, "Private", "Reputed South Indian engineering college with strong industry ties.", "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800"],
    ["SRM Institute of Science and Technology", "Chennai", "Tamil Nadu", 350000, 3.9, "{B.Tech,M.Tech,MBA,PhD}", 83, 9.8, "HCL", 1985, "Private", "Large multi-campus university with diverse program offerings.", "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800"],
    ["IIT Madras", "Chennai", "Tamil Nadu", 240000, 4.9, "{B.Tech,M.Tech,MBA,PhD}", 98, 26.2, "Apple", 1959, "Public", "Ranked #1 in India consistently, known for research and innovation.", "https://images.unsplash.com/photo-1562774053-701939374585?w=800"],
    ["Jadavpur University", "Kolkata", "West Bengal", 50000, 4.4, "{B.Tech,M.Tech,MBA,PhD}", 88, 13.4, "IBM", 1955, "Public", "Premier engineering college of Eastern India with affordable fees.", "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800"],
  ];

  for (const c of colleges) {
    await pool.query(
      `INSERT INTO colleges (name, location, state, fees_per_year, rating, courses, placement_percentage, avg_package_lpa, top_recruiter, established, type, description, image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      c
    );
  }
  console.log("✅ Seeded 12 colleges");
}

// ─── ROUTES ─────────────────────────────────────────────────────────────────

// GET /colleges - list with search + filter
app.get("/colleges", async (req, res) => {
  try {
    const { search, location, min_fees, max_fees, course, page = "1", limit = "9" } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const conditions: string[] = [];
    const values: (string | number)[] = [];
    let idx = 1;

    if (search) {
      conditions.push(`(name ILIKE $${idx} OR location ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }
    if (location) {
      conditions.push(`state = $${idx}`);
      values.push(location as string);
      idx++;
    }
    if (min_fees) {
      conditions.push(`fees_per_year >= $${idx}`);
      values.push(parseInt(min_fees as string));
      idx++;
    }
    if (max_fees) {
      conditions.push(`fees_per_year <= $${idx}`);
      values.push(parseInt(max_fees as string));
      idx++;
    }
    if (course) {
      conditions.push(`$${idx} = ANY(courses)`);
      values.push(course as string);
      idx++;
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const countResult = await pool.query(`SELECT COUNT(*) FROM colleges ${where}`, values);
    const total = parseInt(countResult.rows[0].count);

    values.push(parseInt(limit as string), offset);
    const result = await pool.query(
      `SELECT * FROM colleges ${where} ORDER BY rating DESC LIMIT $${idx} OFFSET $${idx + 1}`,
      values
    );

    res.json({ colleges: result.rows, total, page: parseInt(page as string), totalPages: Math.ceil(total / parseInt(limit as string)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /colleges/:id - single college
app.get("/colleges/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM colleges WHERE id = $1", [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: "College not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /compare?ids=1,2,3
app.get("/compare", async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) return res.status(400).json({ error: "Provide college ids" });
    const idArray = (ids as string).split(",").map(Number).filter(Boolean).slice(0, 3);
    if (idArray.length < 2) return res.status(400).json({ error: "Need at least 2 college ids" });
    const result = await pool.query("SELECT * FROM colleges WHERE id = ANY($1)", [idArray]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /states - for filter dropdown
app.get("/states", async (_req, res) => {
  try {
    const result = await pool.query("SELECT DISTINCT state FROM colleges ORDER BY state");
    res.json(result.rows.map((r) => r.state));
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ─── START ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`🚀 Backend running on port ${PORT}`);

  try {
    await initDB();
    console.log("✅ Database initialized");
  } catch (err) {
    console.error("⚠️ DB init warning (non-fatal):", err);
  }
});
