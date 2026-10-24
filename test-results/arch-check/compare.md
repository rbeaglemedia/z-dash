# Architecture check, boulevard fix batch

Checker: origin/cursor/arch-check-652e at d1b028c, not merged.
Command: node tools/arch-check.mjs --root <tree> --no-shots --review
The harness in that worktree was given city-layout.js and nos-station.js so it reviews the boulevard city. Exit 0 is the review mode. The city still fails checks that were already true on live main 6541c3e.

Live main 6541c3e: 17 fails, 2 warnings. 32 buildings block a road. 0 doors with no road.
This branch: 16 fails, 2 warnings. 1 building blocks a road (the sky tower's own driveway, same spur as live). 0 doors with no road.

Same on both trees, so not introduced here:
- Garage mouth graphic is narrower than the 370Z (20 buildings).
- Window dashes cut panes (live 22, this branch 25 because footprints moved).
- Blank roofs, snack stands at 5 m and color #ff9a2e, snack purpose missing from the style guide.
- NOS canopy glow boxes float and overlap, and the NOS door test sees the canopy (15 notes, both trees).
- 39 ramps versus the old floor of 70. River-edge kicks are still at -40, 60, and -250.
- 31 solids versus Approved count 24. The boulevard map is 36 places. Count was not reduced.
- Purpose words: soccer sign is still TURBO, builder sign is still PIXEL, tower JUMP is small from the street.
- neon-paint.js still assigns shadowBlur. city-draw.js does not.
- Brand warnings: fills are still #0a0612.

Tunnel length, bore, ceiling, and both mouths passed on this branch.
