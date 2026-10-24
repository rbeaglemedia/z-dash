# DEV Builder UI polish

The new UI is the DEV Builder overlay. It is not part of the driver HUD. It opens only after Bob holds the two opposite screen corners for 2 seconds, or on the review page `test/dev-builder.html`.

Checked with `node tools/ui-polish-audit.js --only dev-builder`. Seven viewports, 14 controls each, 0 errors, 0 warnings. Full write-up: `test-results/dev-builder/ui-polish/audit.md`.

| Check | Result |
| --- | --- |
| Button size | 14 buttons. Each is at least 44×44 px |
| Overlaps | None, on a 390×844 phone |
| Clipping | None. The tool row wraps instead of scrolling a button off screen |
| Type | Labels are 13 px. The status line wraps |
| Driver HUD | The overlay covers it while open. Close returns to the drive. There is no new HUD button |
| Blur | The editor canvas does not set `shadowBlur` |
| Adult page | `index.html` does not load the editor |

Screenshots, labeled in the header: `phone.png`, `ipad.png`, `pc.png` in this folder.
