# Spire Atlas · Unofficial Slay the Spire 2 companion

**V1.00** · Responsive GitHub Pages website · No server · No login

This is a second-screen **manual** run tracker and enemy move reference for *Slay the Spire 2*. It cannot detect your position inside the game, read save files, or guarantee random enemy intents.

## Features

- Four illustrated regions: **Overgrowth**, **Underdocks**, **Hive**, **Glory**.
- Save your region, in-game floor, current room, visited floors, and notes locally in your browser.
- Default *single-player* floors: Act 1 **1–17** (Overgrowth or Underdocks), Act 2 **18–33** (Hive), Act 3 **34–49** (Glory). Multiplayer, Golden Compass, and other mechanics can alter floor numbering; this is a simple default tracker, not a literal generated route map.
- Search by enemy name, region, or **Normal / Elite / Boss**.
- Monster portrait images, HP, move lists, intents, per-move damage/block/powers, and community-documented AI patterns.
- A turn selector predicts a move **only when the source explicitly describes an opener or linked cycle**. For conditional or random enemies, it clearly says the future move is uncertain.
- Optional Ascension 9+ damage display where the source specifies values.
- Original region illustrations bundled in `assets/`, and an offline **small demo sample** of enemies.

## Put it on GitHub Pages

1. Download and **unzip** the project.
2. In GitHub, create a new public repository, e.g. `spire-atlas`.
3. Upload the **contents** of this folder to your repo's root: `index.html`, `styles.css`, `app.js`, `README.md`, and `assets/`. Do not just upload the ZIP.
4. In **Settings → Pages**, under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/(root)`, then **Save**.
6. Your site will normally be `https://YOUR-USERNAME.github.io/spire-atlas/` after GitHub finishes publishing.

It is static HTML/CSS/JavaScript — no npm, database, or tokens required.

## Test locally

You can open `index.html` directly to try the included demo data. For the full bestiary, serve the directory over HTTP (some browsers block remote `fetch` when opening a `file://` page):

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000` on the same device.

## Enemy data, internet, and artwork

At page load the browser requests a current English monster JSON database from the public [Spire Codex repository](https://github.com/ptrlrd/spire-codex) and falls back to the [Spire Codex API](https://spire-codex.com/developers) if needed. The JSON contains the enemy info and source image paths. Images load from an **external** Spire Codex service while online. The source service can change without notice. The database is cached in browser local storage after a successful download; pictures aren't bundled. If the source is unavailable, a small bundled demo and stylized placeholders keep the manual tracker working. That demo is **not** the complete game bestiary.

Only explicit state-machine transitions are presented as a deterministic turn order. A fixed opening move isn't proof of a fixed future pattern. Some parsed states may be incomplete and even deterministic opponents can deviate due to conditions or future game patches. Always trust the game's live attack intent. Stats may vary by difficulty, buffs, and updates.

All game names, monster imagery and extracted game information belong to **Mega Crit Games**. Data source: [Spire Codex](https://github.com/ptrlrd/spire-codex), subject to its [public API terms](https://github.com/ptrlrd/spire-codex/blob/main/API_TERMS.md). Unofficial, noncommercial fan reference; not affiliated with Mega Crit or Spire Codex. The four region SVG backgrounds are original artwork generated for this website.

## Data privacy and updating

Progress and cached monster JSON live in **this browser's localStorage**. They are not synced across devices or sent to this project creator. External image and data providers still receive ordinary browser requests. Browser storage can be cleared at any time.

For a site update, edit the source and increase the visible footer version, e.g. `V1.01`, then `V1.02`.
