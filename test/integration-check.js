#!/usr/bin/env node
/* Fixture test for tools/integration-check.js. No game pages, no browser. */
'use strict';
const { spawnSync } = require('child_process');
const path = require('path');
const r = spawnSync(process.execPath, [path.join(__dirname, '..', 'tools', 'integration-check.js'), '--self-test'], { stdio: 'inherit' });
process.exit(r.status == null ? 1 : r.status);
