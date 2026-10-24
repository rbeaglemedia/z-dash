'use strict';
// Same lock-flag readers as jr.html. This page does not set or clear them.
// Keys: zd_world_unlocked (NEON WORLD), zd_fly_unlocked (NEON FLYING), zd_w2_beaten (WANTED level 4).
function flyOpen() { try { return localStorage.getItem('zd_fly_unlocked') === '1'; } /*lockpick*/ catch (e) { return false; } }
function worldOpen() { try { return localStorage.getItem('zd_world_unlocked') === '1'; } /*worldtile*/ catch (e) { return false; } }
