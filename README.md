# 🏋️ Recomp Protocol — Daily Tracker (Cloud-Synced)

A single-page workout + body-recomposition tracker. Opens on today's workout, logs weights/reps/cardio/measurements, and — once you add Supabase — **syncs across all your devices automatically**.

**Goal:** 90.5 kg → 80 kg · 2,100 kcal/day · PPL + Upper/Lower (5 training days)

---

## Two ways to run it

### A) Local-only (works instantly, no setup)
Just host `index.html` on GitHub Pages. Data saves to that browser via localStorage. Use Export/Import JSON to back up or move devices. The status dot shows **"Local only"**.

### B) Cloud-synced (true saving across devices) — recommended
Add a free Supabase project (steps below). Then log from your phone, tablet, laptop — all in sync. The status dot shows **"Cloud synced"**.

Either way the app also keeps a localStorage copy, so it still works offline and just re-syncs when it can.

---

## ☁️ Supabase setup (~10 minutes, one time, free)

### 1. Create a project
1. Go to **https://supabase.com** → sign up (free).
2. Click **New Project**. Give it a name, set a database password (save it somewhere), pick a region near you, and create it. Wait ~2 min for it to spin up.

### 2. Create the table
1. In the left sidebar, open **SQL Editor** → **New query**.
2. Paste this and click **Run**:

```sql
-- One table holding a single JSON blob per "log id"
create table if not exists logs (
  id text primary key,
  payload jsonb,
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table logs enable row level security;

-- Allow anyone with the anon key to read/write (fine for a personal single-user log).
-- If you want it private later, we can add auth.
create policy "public access" on logs
  for all using (true) with check (true);
```

### 3. Get your two keys
1. Left sidebar → **Project Settings** (gear) → **API**.
2. Copy the **Project URL** (looks like `https://abcd1234.supabase.co`).
3. Copy the **anon public** key (a long string under "Project API keys").

### 4. Paste them into index.html
Open `index.html`, find this block near the bottom, and paste your values between the quotes:

```js
const SUPABASE_URL = "https://abcd1234.supabase.co";   // your Project URL
const SUPABASE_ANON_KEY = "eyJhbG...your-anon-key...";  // your anon public key
```

Save. That's it — the app now reads and writes to the cloud.

### 5. Host on GitHub Pages
1. Create a GitHub repo, upload **`index.html`** and **`.nojekyll`**.
2. **Settings → Pages → Deploy from a branch → `main` / root → Save**.
3. Live at `https://<username>.github.io/<repo>/`. Open it on any device — same data everywhere.

> On your phone: open the URL → "Add to Home Screen" for an app-like shortcut.

---

## 🔁 How syncing works

- Every edit saves to localStorage **instantly**, then pushes to Supabase after a brief pause (debounced, so rapid edits = one write).
- On load, the app pulls the latest cloud copy and updates the screen.
- The **status dot** (top of page) shows: `Local only`, `Syncing…`, `Cloud synced` (with last sync time), or `Sync error`.
- All devices share one record, identified by `window._SB_ROW_ID` (default `"my-recomp-log"`). Keep it the same across devices to share data; change it for a separate log.

**Note on simultaneous edits:** this uses last-write-wins. If you log on two devices at the exact same moment, the last save wins. For solo use that's a non-issue.

---

## 🔐 A note on the anon key

The anon key is safe to ship in client-side code — it's designed for that. With the simple policy above, anyone who has your live URL *and* knows your row id could read/write that one row. For a personal fitness log that's normally fine. If you want it locked to just you, we can add Supabase email login — ask and I'll wire it in.

---

## 💾 Backups

Even with cloud sync, the **⬇ Export JSON** button downloads a full copy anytime. Commit that file to your repo for version history, or keep it as a safety net.

---

## 📱 Features

- **Exercises** — opens on today's workout (auto-detects weekday). Preview any day, "Back to Today" to return. Log sets, weights & reps; entries collapse to a clean one-line summary.
- **Weekly** — this-week-vs-last-week performance (volume, sessions, cardio minutes, avg body weight). Month dropdown drives the cardio plan; log cardio here.
- **Nutrition** — 2,100 kcal targets, macros, meal split, Friday cheat meal.
- **Supplements** — full stack with timing.
- **Tracker** — body weight + 8 measurements with how-to-measure guides.

---

## 📅 Weekly split

| Day | Workout |
|-----|---------|
| Saturday | Upper |
| Sunday | Lower |
| Monday | Rest |
| Tuesday | Push |
| Wednesday | Pull |
| Thursday | Legs |
| Friday | Rest (+ cheat meal) |

---

## 🔧 Editing the plan
All plan data lives in `index.html` in the `workouts` object near the top of the main `<script>`. Edit names/sets/reps/rest, save, re-upload.
