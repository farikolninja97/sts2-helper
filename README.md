# Spire Atlas — Slay the Spire 2 enemy move companion

**V1.01** · GitHub Pages ready · Mobile and desktop · Static HTML/CSS/JS, no build step.

This is a fan-made second-screen **enemy attack guide** for *Slay the Spire 2*. It does **not** read the game process or save files and cannot predict random/conditional enemy intents.

## What's new in V1.01

- **Enemy moves are the homepage**, with a game-inspired dark fantasy combat stage, artwork, attack intent, damage, selectable region and search.
- **Floor tracker is its own page**, accessible from the header, home page shortcut, or navigation button. Existing V1.00 floor notes/progress still use the same browser storage key.
- **Strength carries over across turns.** In a completely documented linked cycle, self-applied Strength on earlier turns automatically adds to each later attack hit. For instance, a 3-damage attack after +15 Strength shows **18 damage**; 9 × 2 after +3 Strength shows **12 × 2 (24 total)**.
- For variable/conditional enemies, use **Record moves**. After the enemy actually uses a move, press its **Record move +** button. The app recalculates potential attacks based on previously logged buffs. **Undo**, **New fight**, and **Other STR +/-** are included.
- The turn timeline and current move show buff-adjusted values. Creature images are requested online from the community art source, with a visual fallback when an image cannot be loaded.
- Added an offline Axebot example so multi-hit damage calculations can be tried without the database.

## Deployment to GitHub Pages

1. Extract the ZIP.
2. Upload **`index.html`, `app.js`, `styles.css`, `README.md`, and the complete `assets/` folder** into the root of your GitHub repository.
3. In your repository select **Settings → Pages → Deploy from a branch**, choose `main` and `/(root)`, then **Save**.
4. Your site typically appears at `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/` after GitHub deploys.

To update your existing Spire Atlas, **replace the files** with these new V1.01 versions. The app uses the same storage key as V1.00 to preserve your previous location data on the same browser and origin.

No install, backend, credentials, API keys, database, or framework needed. Open `index.html` directly to try offline sample data, or host it to fetch the full community database.

## How damage prediction works

**Automatic / Documented cycle:** Only use when the parsed source data explicitly supplies linked move transitions. The preview on turn N includes eligible `STRENGTH` powers that the enemy applied **to itself before turn N**. Positive and negative Strength change *each hit*, with damage floored at 0 per hit. Multi-hit attack counts are accounted for.

**Record moves:** For enemies with randomness or conditional actions, the guide does not guess. After seeing an actual move, tap **Record move +** next to that move in the list. Recorded self Strength adds to the enemy's next attack previews. Undo removes the most recent logged move. The **Other STR** +/- buttons add or subtract Strength from **other sources not already recorded**, such as effects from another creature, a card, or an unlisted power.

**Important limits:** Strength modifiers are a planning aid, not a game-state simulator. Other effects (e.g. Weak, Vulnerable, Ritual, special multipliers and any condition-driven strength gain), current-turn execution order, ascension-specific exceptions and combat triggers are **not fully simulated**. Only static direct self Strength powers are counted automatically. Buffs applied on the *current* move are intentionally counted starting the *next* turn, rather than assuming a particular execution order. Use the game's displayed attack intent as authoritative. Community data may be inaccurate or change with patches.

Sample demonstrations: Choose **Act 2 → Hive → Bowlbug (Nectar)**, advance to turn 3 and see 3 → 18 damage after +15 Strength. For multi-hit manual testing, choose **Act 3 → Glory → Axebot**, record **Boot Up** (+3 Strength), and inspect **One Two** (9 × 2 → 12 × 2).

## More features

- Regions: Overgrowth, Underdocks, Hive and Glory, with four included original SVG illustrations.
- Browser-saved floor, room type, visited floors, floor notes, enemy selection and manual combat journals.
- Full bestiary, with categories Normal / Elite / Boss, artwork, AI style and a detail drawer.
- Ascension 9+ data mode where supplied by the source.
- Offline mini bestiary and external enemy artwork fallbacks.
- Version `V1.01` shown in the footer.

## Sources and attribution

Enemy moves, attacks, stats and remote enemy artwork are pulled from the public [Spire Codex](https://github.com/ptrlrd/spire-codex) reference and its image servers, subject to its [API terms](https://github.com/ptrlrd/spire-codex/blob/main/API_TERMS.md). The remote source may be unreachable or change URLs. An offline sample of enemies remains available. Monster art isn't bundled.

*Slay the Spire 2*, original game characters, monsters and game artwork belong to **Mega Crit**. This is an unofficial noncommercial fan tool, unaffiliated with Mega Crit or Spire Codex. The included region SVGs and this website's interface are original fan creations.

Progress and monster data cache are stored in your browser's `localStorage`. External image/data services receive regular requests when you are connected. If you clear browser storage, your tracking data is lost.
