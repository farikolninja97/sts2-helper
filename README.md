# Spire Atlas V1.03 — correct buff-adjusted damage by difficulty

This is a **single-file GitHub Pages release**. Upload/replace **`index.html`** in your existing GitHub Pages repository root. No changes to other files are needed. After publishing, check that the footer reads **V1.03**. If Safari is showing a stale page, append `?v=103` to its URL.

## Why the statue displayed 23 instead of 25

The Bygone Effigy (`BYGONE_EFFIGY`) has **13 base damage normally** and **15 base damage at Ascension 9+**. It gains **+10 Strength** before attacking, making the actual unmodified single-hit damage **23 normal** or **25 A9+**. The original site always started in Normal mode and did not display the other total beside the main result. Source: https://sts.wiki/enemies/bygone-effigy

## V1.03 changes

- A **Normal / A0–8** vs **Ascension 9+** two-option picker now appears beside each enemy's attack preview. Tap the one matching your run.
- Both options show their *final damage including all previous recorded Strength* plus the base damage and buff formula. For multi-hit attacks, final damage totals cover all hits.
- The large damage readout, move list, turn timeline and detailed views follow the selected damage difficulty.
- The smaller enemy move rows show the alternate difficulty's damage when it differs.
- The A9+ checkbox at the top, the readout picker, and the drawer checkbox stay synchronized, and the preference persists across reloads.
- Fixed edge handling for missing `damage.normal` values (do not accidentally treat null as 0 damage).

## Other details

Recorded enemy Strength buffs add +1 damage **per hit**, so +3 Strength applied to a `5 × 2` attack produces `8 × 2 = 16` total. A self-buff on the current action is applied to following actions only. Conditional/random enemy choices still require selecting/recording the move actually used. The app doesn't factor every possible status or player defense into the estimate. Always compare against the in-game enemy intent.

All CSS/JavaScript and custom region illustrations are embedded in `index.html`; the full bestiary and creature portraits require an online community data source, with seven included examples offline. Locally saved run progress from V1.02 is preserved.

Unofficial fan project, not affiliated with Mega Crit.
