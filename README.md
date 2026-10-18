# Spire Atlas V1.02 — Single-file GitHub Pages release

**Fix: missing enemies and mobile layout.** V1.01 separated HTML, JavaScript and stylesheets, so sites where only `index.html` was uploaded showed an empty enemy list and unformatted combat controls. V1.02 embeds the entire JavaScript, CSS and original region illustrations directly inside `index.html`.

## Update your GitHub Pages website

1. Download the ZIP and extract it.
2. Open the existing GitHub repository. In its root folder, upload **`index.html`** from this release, replacing the old `index.html` (use **Upload files** and confirm the overwrite/commit). There are no dependencies on `app.js`, `styles.css` or an `assets` folder.
3. Wait for GitHub Pages to deploy. On iPhone, refresh Safari; if it still shows the old version, open the page in a new Private tab or append `?v=102` to the URL to bypass the old cached page.
4. Look for `V1.02` in the page footer. You should immediately see seven example enemies in the selector, even without online database access. With internet access, the bestiary loads more monsters from the public community data source.

The source list is https://raw.githubusercontent.com/ptrlrd/spire-codex/main/data/eng/monsters.json ; creature portraits are referenced from https://spire-codex.com/static/images/monsters/ and require connectivity. The full bestiary depends on that external source being reachable; only the seven bundled examples are offline. Update from the **↻ Retry** button if your connection was offline during startup.

## What changed in V1.02

- One HTML file does everything: style, enemy selector, floor tracker, region illustrations and Strength tracking.
- All-region enemy list by default. You can filter by region and by Normal/Elite/Boss.
- In-place loading status with a retry button, clearer offline example messaging.
- Additional narrow-screen spacing fixes for iPhone.
- Continues to use the same localStorage key as V1.01 so run progress and combat notes remain saved on the same browser/domain.

Strength calculations are documented self-applied Strength plus manual adjustments. Multi-hit attacks gain Strength on each hit. This does not account for every game effect or predict random/conditional enemy moves. Always confirm in-game intent.

Unofficial fan project; not affiliated with Mega Crit. Enemy move data: https://github.com/ptrlrd/spire-codex .
