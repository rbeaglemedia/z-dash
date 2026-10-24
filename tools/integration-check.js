#!/usr/bin/env node
/**
 * Z-DASH integration check. Kid App only (world.html, world-split.html, world/*.js).
 *
 * Diffs a branch against main, names the systems that changed, and lists dependents
 * that were not updated. Also compares the script lists on world.html (JR menu)
 * and world-split.html.
 *
 *   node tools/integration-check.js --self-test
 *   node tools/integration-check.js --pr 68
 *   node tools/integration-check.js --branch origin/cursor/nos-driveup-58d4 --pr 76
 *   node tools/integration-check.js --open --out test-results/integration-check
 *
 * Docs, tools, and test-results do not count as a shipped runtime change.
 * Adult index.html is flagged when a branch edits it. This tool never edits the game.
 */
'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const OWNERS = {
  layout: {
    id: 'layout',
    title: 'Layout',
    agent: 'Neon world city layout plan',
    branch: 'cursor/city-layout-plan-ef23',
    pr: 68,
    bcId: 'bc-3ff1a27b-8fa0-5250-97f5-63a8eaf5ef23'
  },
  minimap: {
    id: 'minimap',
    title: 'Minimap / HUD',
    agent: 'Neon World minimap (split-map)',
    branch: 'split-map',
    pr: 37,
    bcId: 'bc-8972f8b1-5d6c-5a32-af12-e3b61542f039'
  },
  traffic: {
    id: 'traffic',
    title: 'Traffic',
    agent: 'Neon World Traffic Physics',
    branch: 'cursor/traffic-option-b-2bdb',
    pr: 78,
    bcId: 'bc-2af9e871-f1de-59fc-9680-264931312bdb'
  },
  nos: {
    id: 'nos',
    title: 'NOS stations',
    agent: 'Neon World buildings glow WebGL',
    branch: 'cursor/nos-driveup-58d4',
    pr: 76,
    bcId: 'bc-2a4360f4-477a-5bc9-9177-263bd56d58d4'
  },
  resume: {
    id: 'resume',
    title: 'Resume save',
    agent: 'Neon World Save & Resume',
    branch: 'cursor/world-save-resume-b8a9',
    pr: 79,
    bcId: 'bc-d6a3caca-1ff0-5801-adcf-6baf37bab8a9'
  },
  weather: {
    id: 'weather',
    title: 'Weather',
    agent: 'No weather agent yet',
    branch: '',
    pr: null,
    bcId: ''
  },
  interiors: {
    id: 'interiors',
    title: 'Interiors',
    agent: 'Neon World Interiors',
    branch: 'cursor/interiors-plan-52fc',
    pr: 81,
    bcId: 'bc-80a1fc6f-48ae-5878-8a43-edeea8d052fc'
  },
  planner: {
    id: 'planner',
    title: 'Planner props',
    agent: 'Planner Port: Builder Mode + Props',
    branch: 'cursor/planner-port-plan-cbd5',
    pr: 82,
    bcId: 'bc-40642464-c47e-5d07-9d56-40205ceccbd5'
  },
  buttons: {
    id: 'buttons',
    title: 'Buttons',
    agent: 'Neon World In-Game Buttons & Controls',
    branch: 'split-buttons',
    pr: 44,
    bcId: 'bc-900d1d70-320c-553e-8844-c0df701722d6'
  },
  paint: {
    id: 'paint',
    title: 'Paint and garage',
    agent: "Ellie's Neon Drawing agent",
    branch: 'cursor/neon-paint-studio-door-0eec',
    pr: 71,
    bcId: 'bc-aebd8a72-1734-5f07-aef5-0e74977e0eec'
  },
  crew: {
    id: 'crew',
    title: 'Characters and pets',
    agent: 'Neon World character + pet',
    branch: 'cursor/torso-depth-b5e7',
    pr: 75,
    bcId: 'bc-7f67a79d-81b0-54c0-b24b-afbe865db5e7'
  },
  soccer: {
    id: 'soccer',
    title: 'Soccer',
    agent: 'Neon World car soccer field',
    branch: 'split-soccer',
    pr: 17,
    bcId: 'bc-98d91f77-6188-5c9b-a335-2b3ab43fed8f'
  },
  dance: {
    id: 'dance',
    title: 'Dance',
    agent: "Ellie's Dance Stage & Camera",
    branch: 'split-dance',
    pr: 39,
    bcId: 'bc-33af325d-513e-51ff-8d49-163c08869767'
  },
  air: {
    id: 'air',
    title: 'Air physics',
    agent: 'Neon World Air & Flight Physics',
    branch: 'split-phys-air',
    pr: 45,
    bcId: 'bc-6e81e28f-33e8-5704-a337-040aec016e65'
  },
  cache: {
    id: 'cache',
    title: 'sw.js cache',
    agent: 'The agent who ships the runtime change',
    branch: '',
    pr: null,
    bcId: ''
  },
  objectives: {
    id: 'objectives',
    title: 'Objectives / Hot Drop',
    agent: 'Neon World Save & Resume',
    branch: 'cursor/world-save-resume-b8a9',
    pr: 79,
    bcId: 'bc-d6a3caca-1ff0-5801-adcf-6baf37bab8a9'
  }
};

const PROFILE_KEYS = [
  'zdash.kid.v1',
  'zdash.house.v1',
  'zdash.char.v1',
  'zdash.pet.v1',
  'zdash.crew.v1',
  'zdash.neonpaint.v1',
  'zdash_vinyls_v1',
  'zdash_neon_paint_v1',
  'zdash_garage_v1',
  'zdash_paint3d_v1',
  'zdash.customdance.v1',
  'zdash.petdance.v1'
];

const CATALOG_FILES = [
  'world/house.js',
  'world/detail.js',
  'world/walk-items.js',
  'world/style-sampler.js'
];

const BUNDLE_BRANCHES = {
  'cursor/city-layout-plan-ef23': true,
  'cursor/city-boulevards-ef23': true,
  'cursor/minimap-boulevards-f039': true
};

const SAVE_FAMILIES = [
  ['zdash.kid.', 'zdash.kid.v1'],
  ['zdash.house.', 'zdash.house.v1'],
  ['zdash.char.', 'zdash.char.v1'],
  ['zdash.pet.', 'zdash.pet.v1'],
  ['zdash.crew.', 'zdash.crew.v1'],
  ['zdash.neonpaint.', 'zdash.neonpaint.v1'],
  ['zdash_vinyls_', 'zdash_vinyls_v1'],
  ['zdash_neon_paint_', 'zdash_neon_paint_v1'],
  ['zdash_garage_', 'zdash_garage_v1'],
  ['zdash_paint3d_', 'zdash_paint3d_v1'],
  ['zdash.customdance.', 'zdash.customdance.v1'],
  ['zdash.petdance.', 'zdash.petdance.v1']
];

const LOCAL_SAVE_KEYS = {
  'zdash.world.resume.v1': true,
  'zdash.neonworld.session.v1': true
};

const MENU_HOSTS = [
  'jr.html',
  'char.html',
  'crew.html',
  'dance-stage.html',
  'neon-paint.html',
  'garage-hub.html',
  'fly2.html',
  'fly3.html'
];

function ownerText(id) {
  const o = OWNERS[id];
  if (!o) return id;
  const where = [o.branch && '`' + o.branch + '`', o.pr ? 'PR #' + o.pr : ''].filter(Boolean).join(', ');
  return where ? o.agent + ' (' + where + ')' : o.agent;
}

function selfText(ctx) {
  const branch = ctx.branch ? '`' + String(ctx.branch).replace(/^origin\//, '') + '`' : 'this branch';
  const pr = ctx.pr ? ', PR #' + ctx.pr : '';
  return (ctx.agent || ctx.title || 'This PR') + ' (' + branch + pr + ')';
}

function classify(filePath) {
  const p = filePath.replace(/\\/g, '/');
  const ids = [];
  if (p === 'world/city.js' || p === 'world/city-layout.js' || p === 'world/city-draw.js' || p === 'world/ground.js' || p === 'world/ramps.js' || p === 'world/landings.js' || p === 'docs/CITY-LAYOUT-PLAN.md' || p.startsWith('docs/city-layout/')) ids.push('layout');
  if (p === 'world/hud.js' || p === 'shared/minimap-tune.js') ids.push('minimap');
  if (p === 'world/traffic.js' || p === 'shared/traffic-tune.js' || p === 'world/towdrive.js' || p === 'docs/TRAFFIC-PLAN.md' || p === 'docs/traffic-profile.json') ids.push('traffic');
  if (p === 'world/nos-station.js' || p.startsWith('tools/nos-station')) ids.push('nos');
  if (p === 'world/resume.js' || p === 'world/resume-safe.js' || p === 'tools/resume-check.js') ids.push('resume');
  if (/weather/i.test(p) && !p.startsWith('test-results/')) ids.push('weather');
  if (p === 'world/house.js' || p === 'world/detail.js' || p === 'world/style-sampler.js' || p === 'world/walk-items.js' || p === 'docs/INTERIORS-PLAN.md' || p.startsWith('docs/interiors/')) ids.push('interiors');
  if (p.startsWith('docs/planner/') || p === 'docs/PLANNER-PORT-PLAN.md' || p.startsWith('test/planner-port') || p === 'world/planner-props.js' || p === 'docs/ROOM-PLACE-HOOK.md' || p.startsWith('docs/room-place/')) ids.push('planner');
  if (p === 'world/input.js') ids.push('buttons');
  if (p === 'world/neon-paint.js' || p === 'neon-paint.html' || p === 'world/garage.js' || p === 'world/garagez.js' || p === 'world/icon-garage.js' || p === 'garage-hub.html' || p === 'world/garage-pet.js') ids.push('paint');
  if (p === 'world/crew.js' || p === 'world/crew-data.js' || p === 'shared/crew-state.js' || p === 'shared/char-closet.js' || p === 'char.html' || p === 'crew.html' || p === 'world/room-preview.js') ids.push('crew');
  if (p === 'world/soccer.js' || p === 'shared/soccer-tune.js') ids.push('soccer');
  if (p === 'world/dance-stage.js' || p === 'dance-stage.html') ids.push('dance');
  if (p === 'world/phys-air.js' || p === 'world/flight.js' || p === 'world/phys-ground.js' || p === 'world/landings.js' || p === 'shared/physics.js' || p === 'shared/tune.js') ids.push('air');
  if (p === 'sw.js' || p === 'shared/version.js') ids.push('cache');
  if (p === 'world/objectives.js') ids.push('objectives');
  return ids;
}

function isRuntime(filePath) {
  const p = filePath.replace(/\\/g, '/');
  if (p === 'index.html') return false;
  if (p.startsWith('docs/') || p.startsWith('tools/') || p.startsWith('test/') || p.startsWith('test-results/')) return false;
  if (/\.(md|png|svg|jpg|jpeg|gif|webp|txt)$/i.test(p)) return false;
  if (/^(world|world-split|jr|crew|dance-stage|neon-paint|garage-hub|char|fly2|fly3)\.html$/.test(p)) return true;
  if (p === 'sw.js') return true;
  if (/^manifest.*\.webmanifest$/.test(p)) return true;
  if (/^world\/.+\.(js|json)$/.test(p)) return true;
  if (/^shared\/.+\.(js|css)$/.test(p)) return true;
  return false;
}

function hasFile(files, pred) {
  return files.some((f) => pred(f.path.replace(/\\/g, '/')));
}

function scriptSrcs(html) {
  if (!html) return [];
  const out = [];
  const re = /<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html))) {
    let src = m[1].replace(/\\/g, '/');
    src = src.split('?')[0].split('#')[0];
    src = src.replace(/^\.\.\//, '').replace(/^\.\//, '');
    if (src) out.push(src);
  }
  return out;
}

function queryVersions(html) {
  if (!html) return [];
  const out = [];
  const re = /<script\b[^>]*\bsrc\s*=\s*["'][^"']*?[?&]v=(\d+)/gi;
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

function layoutGeometry(cityDiff) {
  if (!cityDiff) return false;
  return cityDiff.split('\n').some((line) => {
    if (!/^[+-]/.test(line) || /^(\+\+\+|---)/.test(line)) return false;
    return /shop\(/.test(line) ||
      /placePrefab\(/.test(line) ||
      /\.addRoad\(/.test(line) ||
      /roadsX\.push/.test(line) ||
      /roadsZ\.push/.test(line) ||
      /BUILDER_ZONE=\{/.test(line) ||
      /STAD=\{/.test(line) ||
      /TRACK=\{/.test(line) ||
      /XS0=-?\d/.test(line) ||
      /ZS0=-?\d/.test(line);
  });
}

function droppedProfileKeys(keyDiff) {
  if (!keyDiff) return [];
  const added = new Set();
  const removed = new Set();
  for (const line of keyDiff.split('\n')) {
    if (/^(\+\+\+|---)/.test(line)) continue;
    const kind = line[0];
    if (kind !== '+' && kind !== '-') continue;
    for (const key of PROFILE_KEYS) {
      if (line.indexOf(key) !== -1) (kind === '+' ? added : removed).add(key);
    }
  }
  return [...removed].filter((k) => !added.has(k));
}

function branchName(branch) {
  return String(branch || '').replace(/^origin\//, '');
}

function isBundleBranch(branch) {
  return !!BUNDLE_BRANCHES[branchName(branch)];
}

function isNewWorldPage(filePath) {
  const p = filePath.replace(/\\/g, '/');
  if (!/\.html$/i.test(p)) return false;
  if (p === 'world.html' || p === 'world-split.html' || p === 'index.html') return false;
  if (p === 'test/world.html' || p === 'test/world-split.html') return false;
  const base = p.split('/').pop();
  if (base === 'world-split.html') return false;
  return /^world-.+\.html$/i.test(base);
}

function redesignKinds(files, texts) {
  const kinds = [];
  function add(kind) {
    if (kinds.indexOf(kind) === -1) kinds.push(kind);
  }
  const blob = Object.keys(texts || {}).map((k) => texts[k] || '').join('\n');
  files.forEach((f) => {
    const p = f.path.replace(/\\/g, '/');
    if (p === 'world/city-layout.js' || p === 'docs/CITY-LAYOUT-PLAN.md' || p.startsWith('docs/city-layout/')) add('city redesign');
    if (p === 'world/gl-city.js' || p === 'world/gl-city-manifest.json') add('building redesign');
    if (p === 'world/builder.js') add('builders');
  });
  if (/Builder HQ design tool|City Editor|design tool is the planner editor/i.test(blob)) add('builders');
  if (/bakeBuilding/.test(blob)) add('building redesign');
  return kinds;
}

function quotedKeys(line) {
  const found = [];
  const re = /['"](zdash[._][A-Za-z0-9_.]+)['"]/g;
  let m;
  while ((m = re.exec(line))) {
    if (found.indexOf(m[1]) === -1) found.push(m[1]);
  }
  return found;
}

function straySaveKeys(keyDiff) {
  if (!keyDiff) return [];
  const stray = [];
  keyDiff.split('\n').forEach((line) => {
    if (!line || line[0] !== '+' || line.startsWith('+++')) return;
    quotedKeys(line).forEach((key) => {
      if (LOCAL_SAVE_KEYS[key]) return;
      if (PROFILE_KEYS.indexOf(key) !== -1) return;
      const family = SAVE_FAMILIES.some((pair) => key.indexOf(pair[0]) === 0 && key !== pair[1]);
      if (family && stray.indexOf(key) === -1) stray.push(key);
    });
  });
  return stray;
}

function gap(list, item) {
  list.push(Object.assign({ severity: 'gap' }, item));
}

function diffLinesHit(diff, src, mark) {
  if (!diff || !src) return false;
  return diff.split('\n').some((line) => {
    if (!line || line[0] !== mark) return false;
    if (line.startsWith('+++') || line.startsWith('---')) return false;
    return line.indexOf(src) !== -1;
  });
}

function diffDrops(diff, src) {
  return diffLinesHit(diff, src, '-') && !diffLinesHit(diff, src, '+');
}

function menuHostsFor(src, menuHosts) {
  const hosts = menuHosts || {};
  return Object.keys(hosts).filter((page) => scriptSrcs(hosts[page] || '').indexOf(src) !== -1);
}

function previewScripts(ctx, files, kind) {
  const file = kind === 'testWorld' ? 'test/world.html' : 'test/world-split.html';
  const prEdits = files.some((f) => f.path === file);
  const branchHtml = ctx.pages ? ctx.pages[kind] : null;
  const baseHtml = ctx.basePages ? ctx.basePages[kind] : null;
  const html = prEdits ? branchHtml : (baseHtml != null ? baseHtml : branchHtml);
  if (html == null) return null;
  return scriptSrcs(html);
}

function checkOne(ctx) {
  const files = ctx.files || [];
  const systems = [];
  files.forEach((f) => {
    classify(f.path).forEach((id) => {
      if (systems.indexOf(id) === -1) systems.push(id);
    });
  });

  const gaps = [];
  const notes = [];
  const layoutPlan = hasFile(files, (p) => p === 'docs/CITY-LAYOUT-PLAN.md' || p.startsWith('docs/city-layout/'));
  const geometry = layoutGeometry(ctx.cityDiff || '');
  const runtime = files.filter((f) => isRuntime(f.path));
  const versionHead = ctx.versionHead || { world: '', stamp: '', sw: '' };
  const versionBase = ctx.versionBase || { world: '', stamp: '', sw: '' };
  const bumped = !!(versionHead.world && (
    versionHead.world !== versionBase.world ||
    versionHead.stamp !== versionBase.stamp ||
    versionHead.sw !== versionBase.sw
  ));
  const trafficHead = ctx.trafficHead || '';
  const trafficRebuild = /roadsSig|roadSig/.test(trafficHead);
  const trafficReadsRoads = /CITY\.ROADS/.test(trafficHead);
  const resumeHead = ctx.resumeHead || '';
  const resumeGuard = /spotClear|mapStamp/.test(resumeHead) && !!(ctx.cityHasMapStamp || /mapStamp/.test(resumeHead));
  const hotDropUsesRoads = ctx.hotDropUsesRoads !== false;
  const pagesTouched = hasFile(files, (p) => p === 'world.html' || p === 'world-split.html');
  const worldScripts = scriptSrcs(ctx.pages && ctx.pages.world);
  const splitScripts = scriptSrcs(ctx.pages && ctx.pages.split);
  const baseWorld = scriptSrcs(ctx.basePages && ctx.basePages.world);
  const baseSplit = scriptSrcs(ctx.basePages && ctx.basePages.split);
  const htmlDiffs = ctx.htmlDiffs || {};

  function missing(have, need) {
    return need.filter((s) => have.indexOf(s) === -1);
  }

  function onBothBase(src) {
    return baseWorld.indexOf(src) !== -1 && baseSplit.indexOf(src) !== -1;
  }

  function countsAsMismatch(src) {
    if (onBothBase(src) && !diffDrops(htmlDiffs['world.html'], src) && !diffDrops(htmlDiffs['world-split.html'], src)) return false;
    return true;
  }

  if ((pagesTouched || files.some((f) => f.status === 'A' && /^world\/.+\.js$/.test(f.path))) && ctx.pages) {
    const onlyWorld = missing(splitScripts, worldScripts).filter(countsAsMismatch);
    const onlySplit = missing(worldScripts, splitScripts).filter(countsAsMismatch);
    const addedWorldJs = files.filter((f) => f.status === 'A' && /^world\/.+\.js$/.test(f.path)).map((f) => f.path);
    const interesting = pagesTouched || addedWorldJs.length > 0;
    if (interesting && (onlyWorld.length || onlySplit.length)) {
      const bits = [];
      if (onlySplit.length) bits.push('only on world-split.html: ' + onlySplit.join(', '));
      if (onlyWorld.length) bits.push('only on world.html (JR menu): ' + onlyWorld.join(', '));
      gap(gaps, {
        id: 'both-pages',
        system: 'pages',
        summary: 'JR page and world-split load different scripts',
        owner: selfText(ctx),
        ownerId: 'self',
        detail: 'world.html is the page the JR menu opens. ' + bits.join('. ') + '. Both pages have to load the same kid scripts.'
      });
    }
    const testMissingScripts = [];
    addedWorldJs.forEach((p) => {
      const onBranchWorld = worldScripts.indexOf(p) !== -1 || splitScripts.indexOf(p) !== -1;
      const menus = menuHostsFor(p, ctx.menuHosts);
      if (!onBranchWorld && !onBothBase(p)) {
        if (menus.length) {
          notes.push(p + ' loads from ' + menus.join(', ') + '. It is a menu module, so the world pages do not need it.');
        } else {
          gap(gaps, {
            id: 'both-pages-unloaded',
            system: 'pages',
            summary: p + ' is not loaded by either world page',
            owner: selfText(ctx),
            ownerId: 'self',
            detail: p + ' was added and neither world.html nor world-split.html references it.'
          });
        }
      } else if (!onBranchWorld && onBothBase(p)) {
        notes.push(p + ' is already on world.html and world-split.html on main. This branch does not remove that tag.');
      }
      const worldFeature = onBranchWorld || onBothBase(p);
      if (!worldFeature) return;
      const previewWorld = previewScripts(ctx, files, 'testWorld');
      const previewSplit = previewScripts(ctx, files, 'testSplit');
      if (previewWorld == null && previewSplit == null) return;
      const missingPreview = (previewWorld && previewWorld.indexOf(p) === -1) || (previewSplit && previewSplit.indexOf(p) === -1);
      if (missingPreview) testMissingScripts.push(p);
    });
    if (testMissingScripts.length) {
      gap(gaps, {
        id: 'test-mirror',
        system: 'pages',
        summary: 'Hidden /test preview does not load ' + testMissingScripts.join(', '),
        owner: selfText(ctx),
        ownerId: 'self',
        detail: 'test/world.html and test/world-split.html do not reference ' + testMissingScripts.join(', ') + '. The JR preview and the live JR page would disagree.'
      });
    }
    const deleted = files.filter((f) => f.status === 'D' && /^world\/.+\.js$/.test(f.path));
    deleted.forEach((f) => {
      if (worldScripts.indexOf(f.path) !== -1 || splitScripts.indexOf(f.path) !== -1) {
        gap(gaps, {
          id: 'both-pages-deleted',
          system: 'pages',
          summary: f.path + ' was removed but a world page still loads it',
          owner: selfText(ctx),
          ownerId: 'self',
          detail: 'Delete the script tag from world.html and world-split.html together.'
        });
      }
    });
  }

  if (pagesTouched && versionHead.world) {
    const versions = queryVersions((ctx.pages && ctx.pages.world) || '').concat(queryVersions((ctx.pages && ctx.pages.split) || ''));
    const distinct = [...new Set(versions)];
    if (distinct.length > 1 || distinct.some((v) => v !== versionHead.world)) {
      gap(gaps, {
        id: 'query-version',
        system: 'cache',
        summary: 'Script ?v= does not match ZD_WORLD ' + versionHead.world,
        owner: selfText(ctx),
        ownerId: 'self',
        detail: 'world.html / world-split.html advertise ?v=' + (distinct.join(', ') || '(none)') + ' while shared/version.js ZD_WORLD is ' + versionHead.world + '. One token has to win, and it has to be the cache build.'
      });
    }
  }

  if (runtime.length && !bumped) {
    gap(gaps, {
      id: 'cache',
      system: 'cache',
      summary: 'Cache version was not bumped',
      owner: selfText(ctx),
      ownerId: 'self',
      detail: 'Kid runtime changed (' + runtime.map((f) => f.path).slice(0, 8).join(', ') + (runtime.length > 8 ? ', …' : '') + ') and ZD_WORLD (' + (versionHead.world || '?') + '), ZD_BUILD_STAMP, and the sw.js VERSION line match main. Bump shared/version.js so world-split-v and the zdash- cache names move.'
    });
  }

  if (hasFile(files, (p) => p === 'index.html')) {
    gap(gaps, {
      id: 'adult-index',
      system: 'pages',
      summary: 'Adult index.html was edited',
      owner: selfText(ctx),
      ownerId: 'self',
      detail: 'Kid App work does not change adult index.html. The kid build stamp lives in shared/version.js. Revert the adult page unless Bob has already accepted that hunk.'
    });
  }

  const dropped = droppedProfileKeys(ctx.keyDiff || '');
  if (dropped.length) {
    gap(gaps, {
      id: 'saved-keys',
      system: 'paint',
      summary: 'Saved profile key removed: ' + dropped.join(', '),
      owner: selfText(ctx),
      ownerId: 'self',
      detail: 'Garage, Home, paint, crew, or pet readers still depend on ' + dropped.join(', ') + '. A rename has to land in every reader in the same branch (world/garage.js, world/garagez.js, world/house.js, world/icon-garage.js, world/neon-paint.js, world/crew.js, shared/crew-state.js, shared/physics.js).'
    });
  }

  const redesign = redesignKinds(files, ctx.fileTexts);
  const newWorldPages = files.filter((f) => isNewWorldPage(f.path)).map((f) => f.path);
  const loadedByFrozen = ['world/gl-city.js', 'world/city-layout.js'].some((src) => worldScripts.indexOf(src) !== -1 || splitScripts.indexOf(src) !== -1);
  const wiresFrozen = hasFile(files, (p) => p === 'world.html' || p === 'world-split.html') || loadedByFrozen;
  if (redesign.length && !isBundleBranch(ctx.branch) && (wiresFrozen || !newWorldPages.length)) {
    const where = wiresFrozen
      ? ' This branch wires it into world.html and world-split.html. Take that part off the frozen pages.'
      : ' This branch does not add the new page yet, so that part still points at the frozen Neon World.';
    gap(gaps, {
      id: 'frozen-world',
      system: 'pages',
      summary: 'Builders, building redesigns, or a city redesign belong on a new world page',
      owner: selfText(ctx),
      ownerId: 'self',
      detail: 'After the Option 1 Boulevards bundle, world.html and world-split.html take bug fixes, FPS fixes, Ellie\'s interiors, and the planner drop-objects placement tool. This PR adds ' + redesign.join(' and ') + '.' + where + ' Build that part on a new world page, and keep Ellie\'s shared save keys (' + PROFILE_KEYS.join(', ') + ').'
    });
  }
  if (newWorldPages.length) {
    const stray = straySaveKeys(ctx.keyDiff || '');
    if (dropped.length || stray.length) {
      const bits = [];
      if (dropped.length) bits.push('drops ' + dropped.join(', '));
      if (stray.length) bits.push('writes a new key ' + stray.join(', '));
      gap(gaps, {
        id: 'shared-saves',
        system: 'paint',
        summary: 'New world page breaks Ellie\'s shared saves',
        owner: selfText(ctx),
        ownerId: 'self',
        detail: newWorldPages.join(', ') + ' ' + bits.join(' and ') + '. Garage, Home, paint, crew, and pets on the current Neon World still read ' + PROFILE_KEYS.join(', ') + '. The new world has to read and write those same keys.'
      });
    } else {
      notes.push('The new world page keeps Ellie\'s shared save keys.');
    }
  }

  const addsInteraction = hasFile(files, (p) => p === 'world/nos-station.js' || p === 'world/resume.js') ||
    (hasFile(files, (p) => p === 'world/house.js') && /WALK_PAGE|location\.assign/.test(ctx.keyDiff || ''));
  const touchedUi = hasFile(files, (p) => p === 'world/input.js' || p === 'world/hud.js' || p === 'world/icon-garage.js');
  if (addsInteraction && !touchedUi) {
    gap(gaps, {
      id: 'buttons',
      system: 'buttons',
      summary: 'New claim or door has no button or pause-menu update',
      owner: ownerText('buttons'),
      ownerId: 'buttons',
      detail: 'A NOS claim, resume entry, or building door was added without world/input.js, world/hud.js, or world/icon-garage.js. ' + ownerText('buttons') + ' or this branch has to add the control.'
    });
  }

  if (hasFile(files, (p) => p === 'world/nos-station.js') && !resumeGuard) {
    gap(gaps, {
      id: 'resume-nos',
      severity: 'follow',
      system: 'resume',
      summary: 'Resume spots were not rechecked against the NOS pads',
      owner: ownerText('resume'),
      ownerId: 'resume',
      detail: 'The station adds collision on NOS buildings. Resume is not on this branch. ' + ownerText('resume') + ' has to re-resolve saved spots (mapStamp / spotClear) so a car is not restored inside a pump.'
    });
  }

  if (systems.indexOf('planner') !== -1 && ctx.catalogUsed === false) {
    gap(gaps, {
      id: 'catalog',
      system: 'planner',
      summary: 'Interiors and props do not use the shared catalog',
      owner: ownerText('interiors'),
      ownerId: 'interiors',
      detail: 'The prop list is on this branch and ' + CATALOG_FILES.join(', ') + ' do not reference PROP-CATALOG or PLANNER_PROPS. ' + ownerText('interiors') + ' must place from that catalog. ' + ownerText('planner') + ' keeps it the only list.'
    });
  }

  const interiorsCatalogTouch = hasFile(files, (p) => p === 'world/style-sampler.js' || p === 'world/walk-items.js' || p === 'docs/INTERIORS-PLAN.md');
  if (interiorsCatalogTouch && ctx.catalogUsed === false && systems.indexOf('planner') === -1) {
    const interiorsCode = hasFile(files, (p) => p === 'world/style-sampler.js' || p === 'world/walk-items.js');
    gap(gaps, {
      id: 'catalog',
      severity: interiorsCode ? 'gap' : 'before-build',
      system: 'interiors',
      summary: 'Interiors do not use the shared prop catalog',
      owner: ownerText('interiors'),
      ownerId: 'interiors',
      detail: 'This branch changes interiors or walk-in props and does not reference docs/planner/PROP-CATALOG.json. ' + ownerText('planner') + ' owns the catalog (PR #82). ' + ownerText('interiors') + ' has to place sofas, counters, and kit pieces from it instead of a second size list.'
    });
  }

  if (ctx.soccerMoved && !hasFile(files, (p) => p === 'world/hud.js' || p === 'shared/minimap-tune.js')) {
    gap(gaps, {
      id: 'minimap-soccer',
      system: 'minimap',
      summary: 'Soccer field moved and the minimap fallback did not',
      owner: ownerText('minimap'),
      ownerId: 'minimap',
      detail: 'shared/soccer-tune.js field center or size changed. world/hud.js still falls back to the dome at (830, 300) when SOCCER.field is missing. ' + ownerText('minimap') + ' has to match the new pitch.'
    });
  }

  if (layoutPlan && !geometry) {
    const before = [
      ['minimap', 'Minimap still bakes today\'s CITY and hardcodes MINI bounds, spanFar 3400, the airport dot (0, 730), and the soccer dome (830, 300). Option 1 coords are only in docs/city-layout/.', 'minimap'],
      ['traffic', 'Traffic lanes are not rebuilt for the boulevard roads. world/traffic.js on this branch still reads the old CITY.ROADS' + (trafficRebuild ? ' (roadsSig is present here)' : ' and build() does not refresh mid-session') + '. ' + ownerText('traffic') + ' must confirm lanes once the roads exist in city.js. Their roadsSig rebuild is on PR #78, not on this plan.', 'traffic'],
      ['resume', 'Resume save is not on this branch. An absolute spot from today\'s map is invalid after the boulevards move. ' + ownerText('resume') + ' already drafts mapStamp / spotClear on PR #79. The layout build has to keep CITY.mapStamp and CITY.probe, and that resume file has to ship with the move.', 'resume'],
      ['nos', 'Option 1 has one big NOS station on Car Row plus kit canopies. PR #76 fits pumps onto today\'s two NOS buildings. ' + ownerText('nos') + ' has to move the station onto the new road.', 'nos'],
      ['interiors', 'Walk-in rooms still follow today\'s duplicate shops. Option 1 keeps one of each. ' + ownerText('interiors') + ' has to retarget doors when the blocks move.', 'interiors'],
      ['catalog', 'City-kit pieces (welcome arch, garage bay, NOS canopy, sky pad, snack stand) are not in the shared prop catalog on this branch. ' + ownerText('planner') + ' owns docs/planner/PROP-CATALOG.json. Interiors must use that list.', 'planner'],
      ['soccer', 'The plan\'s one middle-east field is not applied to shared/soccer-tune.js (still 830, 300) or the minimap fallback. ' + ownerText('soccer') + ' and ' + ownerText('minimap') + ' have to share one center.', 'soccer'],
      ['dance', 'Option 1 has one dance building whose door opens the stage. ' + ownerText('dance') + ' and the door branch PR #77 have to follow that single building.', 'dance'],
      ['paint', 'Paint studio and Garage Z bays move to one studio and the homestead / kit bays. ' + ownerText('paint') + ' (PR #71 and #77) has to keep WALK_PAGE and the session return key on the new doors.', 'paint'],
      ['crew', 'The pet lounge becomes one homestead building. ' + ownerText('crew') + ' does not need a new pet, and the home preview has to show the moved house.', 'crew'],
      ['buttons', 'New doors (garage bay, snack, paint, dance) need world/input.js or the pause menu. ' + ownerText('buttons') + ' shares that with the door PRs.', 'buttons'],
      ['air', 'The runway stays. Sky Drop pads in the city kit still need world/landings.js heights if those pads move. ' + ownerText('air') + ' confirms pads only.', 'air'],
      ['weather', 'The boulevards map hatches sand, fog, and rain. There is no world/weather.js and no weather branch. No agent owns it yet. When it appears it also touches air, the minimap, and traffic.', 'weather'],
      ['hotdrop', 'Hot Drop follows CITY.ROADS, so it stays on the old streets until city.js is rebuilt. Do not add a second hardcoded beacon. ' + ownerText('objectives') + ' saves the beacon; the layout agent owns the roads it reads.', 'objectives'],
      ['cache', 'Bump shared/version.js and sw.js when the layout code lands. This plan correctly does not bump the live cache.', 'cache'],
      ['pages', 'Any new world script in the build has to be on both world.html and world-split.html.', 'self']
    ];
    before.forEach((row) => {
      gap(gaps, {
        id: 'layout-' + row[0],
        severity: 'before-build',
        system: row[0] === 'hotdrop' ? 'objectives' : row[0] === 'catalog' ? 'planner' : row[0] === 'pages' ? 'pages' : row[0],
        summary: row[1].split('. ')[0].replace(/\.$/, ''),
        owner: row[2] === 'self' ? selfText(ctx) : ownerText(row[2]),
        ownerId: row[2],
        detail: row[1]
      });
    });
    if (hotDropUsesRoads) {
      notes.push('Hot Drop on this branch still derives its spot from CITY.ROADS. It does not need a coordinate edit inside the plan. It does need the roads themselves.');
    }
  }

  const layoutCode = geometry || hasFile(files, (p) => p === 'world/city-layout.js');
  if (layoutCode && !hasFile(files, (p) => p === 'shared/minimap-tune.js') && hasFile(files, (p) => p === 'world/hud.js')) {
    gap(gaps, {
      id: 'layout-minimap-span',
      system: 'minimap',
      summary: 'Minimap zoom span was not updated for the new city size',
      owner: ownerText('minimap'),
      ownerId: 'minimap',
      detail: 'world/hud.js changed with the layout, and shared/minimap-tune.js did not. spanFar is still 3400 m. Option 1 runs past that (highway to z 3000, track to x -1620, homestead south of z -660), so the altitude map crops the city. ' + ownerText('minimap') + ' owns that tune file.'
    });
  }

  if (ctx.weatherDeclared && !hasFile(files, (p) => p === 'world/weather.js')) {
    gap(gaps, {
      id: 'weather',
      system: 'weather',
      summary: 'Weather bands are stored and nothing draws them',
      owner: ownerText('weather'),
      ownerId: 'weather',
      detail: 'The layout data lists Sand, Fog, and Rain rectangles and marks them not built. There is no world/weather.js and no weather branch. Air physics, the minimap, and traffic have no weather hook yet. No agent owns this.'
    });
  }

  if (geometry) {
    if (!hasFile(files, (p) => p === 'world/hud.js' || p === 'shared/minimap-tune.js')) {
      gap(gaps, {
        id: 'layout-minimap',
        system: 'minimap',
        summary: 'City blocks moved and the minimap was not updated',
        owner: ownerText('minimap'),
        ownerId: 'minimap',
        detail: 'world/city.js geometry changed. The minimap reads CITY.ROADS for streets, and it also hardcodes MINI bounds, spanFar, the airport dot, and the soccer dome. ' + ownerText('minimap') + ' has to confirm those against the new map.'
      });
    }
    if (!trafficReadsRoads) {
      gap(gaps, {
        id: 'layout-traffic',
        system: 'traffic',
        summary: 'New roads are not in the traffic lane build',
        owner: ownerText('traffic'),
        ownerId: 'traffic',
        detail: 'world/traffic.js on this branch does not read CITY.ROADS, so new roads will not get lanes. ' + ownerText('traffic') + ' has to rebuild lanes from the graph.'
      });
    } else if (!trafficRebuild) {
      notes.push('Traffic lanes rebuild from CITY.ROADS on the next page load. They do not refresh mid-session (no roadsSig). That is enough for a full reload and not enough for builder-mode road edits.');
    }
    if (!resumeGuard) {
      gap(gaps, {
        id: 'layout-resume',
        system: 'resume',
        summary: 'Moved city can restore a Resume save inside a wall',
        owner: ownerText('resume'),
        ownerId: 'resume',
        detail: 'Building or road coordinates changed and this branch has no mapStamp + spotClear resume guard. ' + ownerText('resume') + ' has to reject a saved spot that fails CITY.probe and snap to the district or road anchor.'
      });
    }
    if (hotDropUsesRoads) {
      notes.push('Hot Drop still uses CITY.ROADS, so the beacon follows the new streets without a second coordinate list.');
    } else {
      gap(gaps, {
        id: 'layout-hotdrop',
        system: 'objectives',
        summary: 'Hot Drop is not reading the new roads',
        owner: ownerText('objectives'),
        ownerId: 'objectives',
        detail: 'world/objectives.js no longer scores CITY.ROADS for the beacon. A layout move leaves the old spot in place.'
      });
    }
    if (runtime.length && !bumped && !gaps.some((g) => g.id === 'cache')) {
      gap(gaps, {
        id: 'cache',
        system: 'cache',
        summary: 'Cache version was not bumped',
        owner: selfText(ctx),
        ownerId: 'self',
        detail: 'Layout code moved and the service-worker build did not.'
      });
    }
  }

  if (layoutPlan || geometry) {
    notes.push('Both world pages must gain any new script together. Adult index.html stays untouched.');
  }

  return {
    pr: ctx.pr || null,
    title: ctx.title || '',
    branch: ctx.branch || '',
    url: ctx.url || '',
    agent: ctx.agent || '',
    systems,
    gaps,
    notes,
    flags: {
      layoutPlan,
      layoutGeometry: geometry,
      trafficRebuild,
      catalogUsed: ctx.catalogUsed === true,
      resumeGuard: !!resumeGuard,
      bumped
    }
  };
}

function reconcilePlan(plan, build) {
  const pr = 'PR #' + build.pr;
  const drop = new Set();
  const extra = [];
  const has = (id) => build.gaps.some((g) => g.id === id);
  const sys = (id) => build.systems.indexOf(id) !== -1;
  if (sys('minimap') && !has('layout-minimap')) drop.add('layout-minimap');
  if (has('layout-minimap-span')) {
    const span = build.gaps.find((g) => g.id === 'layout-minimap-span');
    extra.push({
      id: 'layout-minimap-span',
      severity: 'follow',
      system: 'minimap',
      summary: span.summary,
      owner: span.owner,
      ownerId: 'minimap',
      detail: span.detail + ' The layout build is ' + pr + '.'
    });
  }
  if (!has('layout-traffic')) {
    drop.add('layout-traffic');
    extra.push({
      id: 'layout-traffic',
      severity: 'follow',
      system: 'traffic',
      summary: 'Boulevard roads are on ' + pr + '; mid-session lane rebuild is still PR #78',
      owner: ownerText('traffic'),
      ownerId: 'traffic',
      detail: pr + ' reads CITY.ROADS, so a reload builds lanes. It has no roadsSig. ' + ownerText('traffic') + ' owns that rebuild on PR #78.'
    });
  }
  if (build.flags.resumeGuard) drop.add('layout-resume');
  if (sys('nos')) drop.add('layout-nos');
  if (sys('soccer') && !has('minimap-soccer')) drop.add('layout-soccer');
  if (sys('buttons')) drop.add('layout-buttons');
  if (!has('layout-hotdrop')) drop.add('layout-hotdrop');
  if (build.flags.bumped) drop.add('layout-cache');
  if (!has('both-pages') && !has('both-pages-unloaded')) drop.add('layout-pages');
  if (has('test-mirror')) {
    const t = build.gaps.find((g) => g.id === 'test-mirror');
    extra.push({
      id: 'test-mirror',
      severity: 'follow',
      system: 'pages',
      summary: t.summary,
      owner: selfText(build),
      ownerId: 'self',
      detail: t.detail + ' Fix it on ' + pr + '.'
    });
  }
  if (has('adult-index')) {
    const t = build.gaps.find((g) => g.id === 'adult-index');
    extra.push({
      id: 'adult-index',
      severity: 'follow',
      system: 'pages',
      summary: t.summary,
      owner: selfText(build),
      ownerId: 'self',
      detail: t.detail + ' That edit is on ' + pr + '.'
    });
  }
  const interiors = plan.gaps.find((g) => g.id === 'layout-interiors');
  if (interiors && sys('interiors') && interiors.detail.indexOf(pr) === -1) {
    interiors.detail += ' ' + pr + ' already moves city doors (house.js). Room interiors are still this agent.';
  }
  const catalog = plan.gaps.find((g) => g.id === 'layout-catalog');
  if (catalog && !build.flags.catalogUsed && catalog.detail.indexOf(pr) === -1) {
    catalog.detail += ' ' + pr + ' does not reference the catalog either.';
  }
  const weather = plan.gaps.find((g) => g.id === 'layout-weather');
  if (weather && has('weather') && weather.detail.indexOf(pr) === -1) {
    weather.detail += ' ' + pr + ' stores the rectangles and still does not draw them.';
  }
  plan.gaps = plan.gaps.filter((g) => !drop.has(g.id)).concat(extra);
  if (!plan.notes) plan.notes = [];
  plan.notes.unshift(pr + ' (' + String(build.branch || 'layout build').replace(/^origin\//, '') + ') is the code build of this plan. Live pages, the minimap frame, the soccer center, NOS, the resume guard, and the cache bump are on that branch. What remains is listed below.');
}

function applyCross(reports) {
  const list = reports || [];
  const resumeReport = list.find((r) => r.flags && r.flags.resumeGuard);
  const trafficReport = list.find((r) => r.flags && r.flags.trafficRebuild);
  const build = list.find((r) => r.flags && r.flags.layoutGeometry && r.pr);
  list.forEach((r) => {
    if (r.flags && r.flags.layoutPlan && build && build.pr !== r.pr) {
      reconcilePlan(r, build);
      return;
    }
    if (r.flags && r.flags.layoutPlan && resumeReport) {
      const hit = r.gaps.find((g) => g.id === 'layout-resume');
      if (hit && hit.detail.indexOf('PR #' + resumeReport.pr) === -1) {
        hit.detail += ' Open resume branch: PR #' + resumeReport.pr + ' (' + resumeReport.branch + ').';
      }
    }
    if (r.flags && r.flags.layoutPlan && trafficReport && !r.flags.trafficRebuild) {
      const hit = r.gaps.find((g) => g.id === 'layout-traffic');
      if (hit && hit.detail.indexOf('PR #' + trafficReport.pr) === -1) {
        hit.detail += ' Lane rebuild is on PR #' + trafficReport.pr + ' only.';
      }
    }
  });
  return list;
}

function systemsLine(ids) {
  if (!ids.length) return 'none';
  return ids.map((id) => (OWNERS[id] ? OWNERS[id].title : id)).join(', ');
}

function commentMarkdown(report) {
  const pr = report.pr ? 'PR #' + report.pr : (report.branch || 'branch');
  const lines = [];
  lines.push('## Integration check');
  lines.push('');
  lines.push('Kid App cross-system pass for ' + pr + (report.title ? ' — ' + report.title : '') + '.');
  lines.push('');
  lines.push('Systems touched: ' + (systemsLine(report.systems) || 'none') + '.');
  lines.push('');
  const now = report.gaps.filter((g) => g.severity === 'gap');
  const follow = report.gaps.filter((g) => g.severity === 'follow');
  const before = report.gaps.filter((g) => g.severity === 'before-build');
  if (!report.gaps.length) {
    lines.push('No missing dependents. Both pages, cache, and the saved-key check did not flag this diff.');
  } else {
    if (now.length) {
      lines.push('### Fix on this branch');
      lines.push('');
      now.forEach((g) => {
        lines.push('- **' + g.summary + '.** Owner: ' + g.owner + '. ' + g.detail);
      });
      lines.push('');
    }
    if (follow.length) {
      lines.push('### Sibling branch');
      lines.push('');
      follow.forEach((g) => {
        lines.push('- **' + g.summary + '.** Owner: ' + g.owner + '. ' + g.detail);
      });
      lines.push('');
    }
    if (before.length) {
      const built = (report.notes || []).some((n) => /code build of this plan/.test(n));
      lines.push(built ? '### Still open on the plan' : '### Before this plan is built');
      lines.push('');
      lines.push(built
        ? 'The boulevard build covers the live map, minimap frame, soccer, NOS, resume, buttons, and the cache bump. These owners are still not done:'
        : 'The plan itself does not ship game code. These owners still have no update for it:');
      lines.push('');
      before.forEach((g) => {
        let rest = '';
        if (g.detail && g.summary && g.detail.indexOf(g.summary) === 0) rest = g.detail.slice(g.summary.length).replace(/^\.?\s*/, '');
        else if (g.detail && g.detail !== g.summary) rest = g.detail;
        lines.push('- **' + g.summary + '.** Owner: ' + g.owner + '.' + (rest ? ' ' + rest : ''));
      });
      lines.push('');
    }
  }
  if (report.notes && report.notes.length) {
    lines.push('Checked and left as-is:');
    lines.push('');
    report.notes.forEach((n) => lines.push('- ' + n));
    lines.push('');
  }
  lines.push('Map: `docs/INTEGRATION-MAP.md`. Tool: `node tools/integration-check.js --pr ' + (report.pr || '') + '`.');
  return lines.join('\n').replace(/\s+$/, '') + '\n';
}

function tableRow(report) {
  const now = report.gaps.filter((g) => g.severity !== 'before-build');
  const before = report.gaps.filter((g) => g.severity === 'before-build');
  let gapsCell = 'none';
  if (now.length || before.length) {
    const parts = [];
    if (now.length) parts.push(now.map((g) => g.summary).join('; '));
    if (before.length) parts.push('before build: ' + before.map((g) => g.system).join(', '));
    gapsCell = parts.join(' | ');
  }
  const owners = [];
  report.gaps.forEach((g) => {
    if (owners.indexOf(g.owner) === -1) owners.push(g.owner);
  });
  const ownerCell = owners.length ? owners.join('; ') : (report.agent || '—');
  return { pr: report.pr, title: report.title, gaps: gapsCell, owner: ownerCell, gapCount: report.gaps.length, nowCount: now.length };
}

function git(args) {
  return execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe']
  });
}

function gitQuiet(args) {
  try {
    return git(args);
  } catch (e) {
    return '';
  }
}

function gitShow(spec) {
  try {
    return git(['show', spec]);
  } catch (e) {
    return null;
  }
}

function parseNameStatus(text) {
  const files = [];
  text.split('\n').forEach((line) => {
    if (!line.trim()) return;
    const parts = line.split('\t');
    const status = parts[0] || '';
    if (status[0] === 'R' || status[0] === 'C') files.push({ status: status[0], path: parts[2], from: parts[1] });
    else files.push({ status: status[0], path: parts[1] });
  });
  return files;
}

function parseVersion(text) {
  const world = (text.match(/ZD_WORLD\s*=\s*'([^']*)'/) || [])[1] || '';
  const stamp = (text.match(/ZD_BUILD_STAMP\s*=\s*'([^']*)'/) || [])[1] || '';
  return { world, stamp };
}

function parseSw(text) {
  const m = text.match(/const VERSION = '([^']*)'/);
  return m ? m[1] : '';
}

function remoteRef(branch) {
  const name = String(branch || '');
  if (name.startsWith('origin/')) return name;
  return 'origin/' + name;
}

function loadBranch(meta, base) {
  const head = remoteRef(meta.branch);
  const nameStatus = git(['diff', '--name-status', base + '...' + head]);
  const files = parseNameStatus(nameStatus);
  const needPages = files.some((f) => f.path === 'world.html' || f.path === 'world-split.html' || (f.status === 'A' && /^world\/.+\.js$/.test(f.path)) || (f.status === 'D' && /^world\/.+\.js$/.test(f.path)));
  const pages = { world: '', split: '', testWorld: null, testSplit: null };
  const basePages = { world: '', split: '', testWorld: null, testSplit: null };
  const menuHosts = {};
  const htmlDiffs = {};
  if (needPages) {
    pages.world = gitShow(head + ':world.html');
    pages.split = gitShow(head + ':world-split.html');
    pages.testWorld = gitShow(head + ':test/world.html');
    pages.testSplit = gitShow(head + ':test/world-split.html');
    basePages.world = gitShow(base + ':world.html');
    basePages.split = gitShow(base + ':world-split.html');
    basePages.testWorld = gitShow(base + ':test/world.html');
    basePages.testSplit = gitShow(base + ':test/world-split.html');
    ['world.html', 'world-split.html', 'test/world.html', 'test/world-split.html'].forEach((file) => {
      if (files.some((f) => f.path === file)) htmlDiffs[file] = gitQuiet(['diff', '-U0', base + '...' + head, '--', file]);
    });
    if (files.some((f) => f.status === 'A' && /^world\/.+\.js$/.test(f.path))) {
      MENU_HOSTS.forEach((page) => {
        const html = gitShow(head + ':' + page);
        if (html != null) menuHosts[page] = html;
      });
    }
  }
  const versionText = gitQuiet(['show', head + ':shared/version.js']);
  const swText = gitQuiet(['show', head + ':sw.js']);
  const baseVersionText = gitQuiet(['show', base + ':shared/version.js']);
  const baseSwText = gitQuiet(['show', base + ':sw.js']);
  const vHead = parseVersion(versionText);
  const vBase = parseVersion(baseVersionText);
  vHead.sw = parseSw(swText);
  vBase.sw = parseSw(baseSwText);
  let cityDiff = '';
  if (files.some((f) => f.path === 'world/city.js')) cityDiff = gitQuiet(['diff', '-U0', base + '...' + head, '--', 'world/city.js']);
  const keyPaths = files.map((f) => f.path).filter((p) => /^world\/.+\.js$/.test(p) || /^shared\/.+\.js$/.test(p));
  let keyDiff = '';
  if (keyPaths.length) keyDiff = gitQuiet(['diff', '-U0', base + '...' + head, '--'].concat(keyPaths.slice(0, 40)));
  const wantTraffic = files.some((f) => f.path === 'world/traffic.js' || f.path === 'docs/CITY-LAYOUT-PLAN.md' || f.path.startsWith('docs/city-layout/') || f.path === 'world/city.js');
  const trafficHead = wantTraffic ? gitQuiet(['show', head + ':world/traffic.js']) : 'CITY.ROADS\n';
  const wantResume = files.some((f) => f.path === 'world/resume.js' || f.path === 'world/resume-safe.js' || f.path === 'world/city.js' || f.path === 'world/nos-station.js' || f.path === 'docs/CITY-LAYOUT-PLAN.md' || f.path === 'world/city-layout.js');
  let resumeHead = '';
  if (wantResume) {
    resumeHead = gitQuiet(['show', head + ':world/resume.js']);
    if (!resumeHead.trim()) resumeHead = gitQuiet(['show', head + ':world/resume-safe.js']);
  }
  let weatherDeclared = false;
  if (files.some((f) => f.path === 'world/city-layout.js')) {
    weatherDeclared = /weather\s*=\s*\[/.test(gitQuiet(['show', head + ':world/city-layout.js']));
  }
  const cityHasMapStamp = wantResume ? /function mapStamp|mapStamp\(/.test(gitQuiet(['show', head + ':world/city.js'])) : false;
  const hotDropUsesRoads = files.some((f) => f.path === 'world/objectives.js' || f.path === 'world/city.js' || f.path === 'docs/CITY-LAYOUT-PLAN.md')
    ? /CITY\.ROADS/.test(gitQuiet(['show', head + ':world/objectives.js']))
    : true;
  const catalogTouch = files.some((f) => classify(f.path).indexOf('planner') !== -1 || f.path === 'world/style-sampler.js' || f.path === 'world/walk-items.js' || f.path === 'docs/INTERIORS-PLAN.md');
  let catalogUsed = false;
  if (catalogTouch) {
    const hit = gitQuiet(['grep', '-l', '-E', 'PROP-CATALOG|PLANNER_PROPS|planner-port/catalog', head, '--', 'world/house.js', 'world/detail.js', 'world/walk-items.js', 'world/style-sampler.js', 'world/planner-props.js']);
    catalogUsed = !!hit.trim();
  }
  const fileTexts = {};
  files.forEach((f) => {
    const p = f.path.replace(/\\/g, '/');
    if (p === 'docs/PLANNER-PORT-PLAN.md' || p === 'world/builder.js' || p.startsWith('world/planner/')) {
      fileTexts[p] = gitShow(head + ':' + p) || '';
    }
  });
  let soccerMoved = false;
  if (files.some((f) => f.path === 'shared/soccer-tune.js' || f.path === 'world/soccer.js')) {
    const soccerDiff = gitQuiet(['diff', '-U0', base + '...' + head, '--', 'shared/soccer-tune.js', 'world/soccer.js']);
    soccerMoved = /^[+-].*(fieldCx|fieldCz|fieldHw|fieldHl)/m.test(soccerDiff);
  }
  return checkOne({
    pr: meta.pr,
    title: meta.title,
    branch: head,
    url: meta.url,
    agent: meta.agent || '',
    files,
    pages,
    basePages,
    menuHosts,
    htmlDiffs,
    versionHead: vHead,
    versionBase: vBase,
    cityDiff,
    keyDiff,
    trafficHead,
    resumeHead,
    cityHasMapStamp,
    hotDropUsesRoads,
    catalogUsed: catalogTouch ? catalogUsed : undefined,
    soccerMoved,
    weatherDeclared,
    fileTexts
  });
}

function markdownTable(rows) {
  const head = '| PR | Title | Gaps | Owner |';
  const rule = '| --- | --- | --- | --- |';
  const body = rows.map((r) => '| #' + r.pr + ' | ' + String(r.title || '').replace(/\|/g, '/') + ' | ' + String(r.gaps).replace(/\|/g, '/') + ' | ' + String(r.owner).replace(/\|/g, '/') + ' |');
  return [head, rule].concat(body).join('\n') + '\n';
}

function runOpen(base, outDir) {
  const raw = execFileSync('gh', ['pr', 'list', '--state', 'open', '--limit', '80', '--json', 'number,title,headRefName,url'], { cwd: ROOT, encoding: 'utf8' });
  const prs = JSON.parse(raw);
  const reports = prs.map((p) => loadBranch({
    pr: p.number,
    title: p.title,
    branch: p.headRefName,
    url: p.url,
    agent: ownerAgentForBranch(p.headRefName)
  }, base));
  applyCross(reports);
  const rows = reports.map(tableRow);
  if (outDir) {
    fs.mkdirSync(outDir, { recursive: true });
    fs.mkdirSync(path.join(outDir, 'comments'), { recursive: true });
    fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify({ base, reports, rows }, null, 2));
    const md = ['# Integration check', '', 'Base: `' + base + '`.', '', markdownTable(rows), ''];
    reports.forEach((r) => {
      md.push('## PR #' + r.pr + ' ' + r.title, '', commentMarkdown(r), '');
      fs.writeFileSync(path.join(outDir, 'comments', 'pr-' + r.pr + '.md'), commentMarkdown(r));
    });
    fs.writeFileSync(path.join(outDir, 'report.md'), md.join('\n'));
  }
  return { reports, rows };
}

const EXTRA_BRANCHES = {
  'split-map': 'minimap',
  'cursor/minimap-boulevards-f039': 'minimap',
  'cursor/city-boulevards-ef23': 'layout',
  'cursor/traffic-plan-2bdb': 'traffic',
  'cursor/split-webgl-58d4': 'nos',
  'cursor/style-sampler-52fc': 'interiors',
  'cursor/interiors-plan-52fc': 'interiors',
  'cursor/room-place-hook-52fc': 'interiors',
  'cursor/garage-dance-doors-0eec': 'paint',
  'cursor/neon-paint-studio-door-0eec': 'paint'
};

function ownerAgentForBranch(branch) {
  const name = String(branch || '').replace(/^origin\//, '');
  if (EXTRA_BRANCHES[name] && OWNERS[EXTRA_BRANCHES[name]]) return OWNERS[EXTRA_BRANCHES[name]].agent;
  const hit = Object.keys(OWNERS).map((k) => OWNERS[k]).find((o) => o.branch && (name === o.branch || name.endsWith(o.branch)));
  return hit ? hit.agent : '';
}

function runSelfTest() {
  const failures = [];
  function expect(name, cond) {
    if (!cond) failures.push(name);
  }
  const plan = checkOne({
    pr: 68,
    title: 'Option 1',
    branch: 'cursor/city-layout-plan-ef23',
    agent: OWNERS.layout.agent,
    files: [{ status: 'A', path: 'docs/CITY-LAYOUT-PLAN.md' }, { status: 'A', path: 'docs/city-layout/coords.json' }],
    trafficHead: 'if (built) return;\nconst R = CITY.ROADS;',
    resumeHead: '',
    hotDropUsesRoads: true,
    catalogUsed: false,
    versionHead: { world: '30', stamp: '1', sw: 'zdash-abc-world30' },
    versionBase: { world: '30', stamp: '1', sw: 'zdash-abc-world30' }
  });
  expect('plan has before-build minimap', plan.gaps.some((g) => g.id === 'layout-minimap'));
  expect('plan has traffic', plan.gaps.some((g) => g.id === 'layout-traffic'));
  expect('plan has resume', plan.gaps.some((g) => g.id === 'layout-resume'));
  expect('plan has weather', plan.gaps.some((g) => g.id === 'layout-weather'));
  expect('plan has catalog', plan.gaps.some((g) => g.id === 'layout-catalog'));
  expect('plan does not now-fail cache', !plan.gaps.some((g) => g.id === 'cache' && g.severity === 'gap'));
  expect('plan cache is before-build', plan.gaps.some((g) => g.id === 'layout-cache'));

  const splitOnly = checkOne({
    pr: 76,
    title: 'NOS',
    branch: 'cursor/nos-driveup-58d4',
    agent: OWNERS.nos.agent,
    files: [
      { status: 'A', path: 'world/gl-city.js' },
      { status: 'A', path: 'world/nos-station.js' },
      { status: 'M', path: 'world.html' },
      { status: 'M', path: 'world-split.html' },
      { status: 'M', path: 'world/input.js' },
      { status: 'M', path: 'shared/version.js' },
      { status: 'M', path: 'sw.js' },
      { status: 'M', path: 'index.html' }
    ],
    pages: {
      world: '<script src="world/nos-station.js?v=31"></script>',
      split: '<script src="world/nos-station.js?v=31"></script><script src="world/gl-city.js?v=31"></script>',
      testWorld: '<script src="../world/boot.js?v=31"></script>',
      testSplit: '<script src="../world/boot.js?v=31"></script>'
    },
    versionHead: { world: '31', stamp: '2', sw: 'zdash-abc-world' },
    versionBase: { world: '30', stamp: '1', sw: 'zdash-abc-world' },
    trafficHead: 'CITY.ROADS',
    resumeHead: '',
    catalogUsed: undefined
  });
  expect('gl-city both pages', splitOnly.gaps.some((g) => g.id === 'both-pages' && /gl-city/.test(g.detail)));
  expect('adult index', splitOnly.gaps.some((g) => g.id === 'adult-index'));
  expect('test mirror', splitOnly.gaps.some((g) => g.id === 'test-mirror'));
  expect('nos cache bumped', !splitOnly.gaps.some((g) => g.id === 'cache'));
  expect('nos buttons satisfied', !splitOnly.gaps.some((g) => g.id === 'buttons'));
  expect('resume follow', splitOnly.gaps.some((g) => g.id === 'resume-nos'));

  const pose = checkOne({
    pr: 78,
    title: 'traffic pose',
    branch: 'cursor/traffic-option-b-2bdb',
    files: [
      { status: 'M', path: 'world/traffic.js' },
      { status: 'M', path: 'shared/traffic-tune.js' },
      { status: 'M', path: 'world.html' },
      { status: 'M', path: 'world-split.html' }
    ],
    pages: {
      world: '<script src="world/traffic.js?v=31"></script><script src="world/hud.js?v=30"></script>',
      split: '<script src="world/traffic.js?v=31"></script><script src="world/hud.js?v=30"></script>'
    },
    versionHead: { world: '30', stamp: '1', sw: 'zdash-abc-world30' },
    versionBase: { world: '30', stamp: '1', sw: 'zdash-abc-world30' },
    trafficHead: 'function roadsSig(){ const R = CITY.ROADS; }\nroadSig',
    resumeHead: ''
  });
  expect('pose cache', pose.gaps.some((g) => g.id === 'cache'));
  expect('pose query', pose.gaps.some((g) => g.id === 'query-version'));
  expect('pose no layout cascade', !pose.gaps.some((g) => g.id === 'layout-minimap'));

  const resume = checkOne({
    pr: 79,
    title: 'resume',
    branch: 'cursor/world-save-resume-b8a9',
    files: [
      { status: 'A', path: 'world/resume.js' },
      { status: 'M', path: 'world/city.js' },
      { status: 'M', path: 'world/hud.js' },
      { status: 'M', path: 'world.html' },
      { status: 'M', path: 'world-split.html' }
    ],
    cityDiff: '+  function mapStamp(){let h=1;mix(XS0);mix(BL.length);}\n',
    pages: {
      world: '<script src="world/resume.js?v=30"></script>',
      split: '<script src="world/resume.js?v=30"></script>',
      testWorld: '<script src="../world/resume.js?v=30"></script>',
      testSplit: '<script src="../world/resume.js?v=30"></script>'
    },
    versionHead: { world: '30', stamp: '1', sw: 'a' },
    versionBase: { world: '30', stamp: '1', sw: 'a' },
    trafficHead: 'CITY.ROADS',
    resumeHead: 'function spotClear(){} function mapStamp(){}',
    cityHasMapStamp: true,
    hotDropUsesRoads: true
  });
  expect('resume cache', resume.gaps.some((g) => g.id === 'cache'));
  expect('resume mapStamp is not geometry', !resume.flags.layoutGeometry);
  expect('resume no minimap cascade', !resume.gaps.some((g) => g.id === 'layout-minimap'));
  expect('resume pages match', !resume.gaps.some((g) => g.id === 'both-pages'));

  const catalog = checkOne({
    pr: 82,
    title: 'planner',
    branch: 'cursor/planner-port-plan-cbd5',
    files: [{ status: 'A', path: 'docs/planner/PROP-CATALOG.json' }, { status: 'A', path: 'docs/PLANNER-PORT-PLAN.md' }],
    catalogUsed: false,
    versionHead: { world: '30', stamp: '1', sw: 'a' },
    versionBase: { world: '30', stamp: '1', sw: 'a' }
  });
  expect('catalog gap', catalog.gaps.some((g) => g.id === 'catalog'));
  expect('catalog owner interiors', catalog.gaps.some((g) => g.id === 'catalog' && g.ownerId === 'interiors'));

  const keys = checkOne({
    pr: 1,
    title: 'keys',
    files: [{ status: 'M', path: 'world/garagez.js' }],
    keyDiff: "-  const KEY='zdash.kid.v1';\n+  const KEY='zdash.kid.v2';\n",
    versionHead: { world: '31', stamp: '2', sw: 'b' },
    versionBase: { world: '30', stamp: '1', sw: 'a' }
  });
  expect('saved key', keys.gaps.some((g) => g.id === 'saved-keys'));

  const clean = checkOne({
    pr: 67,
    title: 'ideas',
    files: [{ status: 'A', path: 'docs/IDEAS.md' }],
    versionHead: { world: '30', stamp: '1', sw: 'a' },
    versionBase: { world: '30', stamp: '1', sw: 'a' }
  });
  expect('ideas clean', clean.gaps.length === 0);

  const geom = checkOne({
    pr: 3,
    title: 'move shop',
    files: [{ status: 'M', path: 'world/city.js' }],
    cityDiff: "-  shop(1,2,3,4,5,{purpose:'NOS'});\n+  shop(10,20,30,40,5,{purpose:'NOS'});\n",
    trafficHead: 'const R = CITY.ROADS;',
    resumeHead: '',
    hotDropUsesRoads: true,
    versionHead: { world: '31', stamp: '9', sw: 'b' },
    versionBase: { world: '30', stamp: '1', sw: 'a' }
  });
  expect('geometry minimap', geom.gaps.some((g) => g.id === 'layout-minimap'));
  expect('geometry resume', geom.gaps.some((g) => g.id === 'layout-resume'));
  expect('geometry traffic reads roads', !geom.gaps.some((g) => g.id === 'layout-traffic'));

  const boulevards = checkOne({
    pr: 85,
    title: 'boulevards',
    branch: 'cursor/city-boulevards-ef23',
    agent: OWNERS.layout.agent,
    files: [
      { status: 'A', path: 'world/city-layout.js' },
      { status: 'A', path: 'world/resume-safe.js' },
      { status: 'A', path: 'world/nos-station.js' },
      { status: 'A', path: 'world/gl-city.js' },
      { status: 'M', path: 'world/city.js' },
      { status: 'M', path: 'world/hud.js' },
      { status: 'M', path: 'world/traffic.js' },
      { status: 'M', path: 'world.html' },
      { status: 'M', path: 'world-split.html' },
      { status: 'M', path: 'shared/version.js' },
      { status: 'M', path: 'index.html' }
    ],
    cityDiff: "+  shop(458,622,2288,2352,34,{purpose:'NOS'});\n",
    pages: {
      world: '<script src="world/city-layout.js?v=32"></script><script src="world/nos-station.js?v=32"></script><script src="world/gl-city.js?v=32"></script><script src="world/resume-safe.js?v=32"></script>',
      split: '<script src="world/city-layout.js?v=32"></script><script src="world/nos-station.js?v=32"></script><script src="world/gl-city.js?v=32"></script><script src="world/resume-safe.js?v=32"></script>',
      testWorld: '',
      testSplit: ''
    },
    versionHead: { world: '32', stamp: '9', sw: 'b' },
    versionBase: { world: '30', stamp: '1', sw: 'a' },
    trafficHead: 'const R = CITY.ROADS;',
    resumeHead: 'function spotClear(){} C.mapStamp',
    cityHasMapStamp: true,
    hotDropUsesRoads: true,
    weatherDeclared: true
  });
  expect('boulevard span', boulevards.gaps.some((g) => g.id === 'layout-minimap-span'));
  expect('boulevard weather', boulevards.gaps.some((g) => g.id === 'weather'));
  expect('boulevard resume guarded', !boulevards.gaps.some((g) => g.id === 'layout-resume'));
  expect('boulevard pages match', !boulevards.gaps.some((g) => g.id === 'both-pages'));
  expect('boulevard test preview', boulevards.gaps.some((g) => g.id === 'test-mirror' && /city-layout/.test(g.detail)));
  expect('boulevard adult', boulevards.gaps.some((g) => g.id === 'adult-index'));

  const menu = checkOne({
    pr: 70,
    title: 'home preview',
    files: [
      { status: 'A', path: 'world/garage-pet.js' },
      { status: 'A', path: 'world/room-preview.js' },
      { status: 'M', path: 'jr.html' }
    ],
    pages: {
      world: '<script src="world/boot.js?v=31"></script>',
      split: '<script src="world/boot.js?v=31"></script>',
      testWorld: '<script src="../world/boot.js?v=31"></script>',
      testSplit: '<script src="../world/boot.js?v=31"></script>'
    },
    menuHosts: {
      'jr.html': '<script src="world/garage-pet.js?v=31"></script><script src="world/room-preview.js?v=31"></script>'
    },
    versionHead: { world: '31', stamp: '2', sw: 'b' },
    versionBase: { world: '30', stamp: '1', sw: 'a' }
  });
  expect('menu modules are not world-page misses', !menu.gaps.some((g) => g.id === 'both-pages-unloaded' || g.id === 'test-mirror'));

  const staleDance = checkOne({
    pr: 39,
    title: 'dance',
    files: [
      { status: 'A', path: 'world/dance-stage.js' },
      { status: 'A', path: 'dance-stage.html' }
    ],
    pages: {
      world: '<script src="world/boot.js"></script>',
      split: '<script src="world/boot.js"></script>',
      testWorld: null,
      testSplit: null
    },
    basePages: {
      world: '<script src="world/dance-stage.js?v=30"></script>',
      split: '<script src="world/dance-stage.js?v=30"></script>',
      testWorld: '<script src="../world/dance-stage.js?v=30"></script>',
      testSplit: '<script src="../world/dance-stage.js?v=30"></script>'
    },
    versionHead: { world: '31', stamp: '2', sw: 'b' },
    versionBase: { world: '30', stamp: '1', sw: 'a' }
  });
  expect('stale dance script is already on main', !staleDance.gaps.some((g) => g.id === 'both-pages-unloaded' || g.id === 'test-mirror' || g.id === 'both-pages'));

  applyCross([plan, boulevards]);
  expect('plan names the boulevard build', plan.notes.some((n) => /PR #85/.test(n)));
  expect('plan resume is covered by the build', !plan.gaps.some((g) => g.id === 'layout-resume'));
  expect('plan weather stays open', plan.gaps.some((g) => g.id === 'layout-weather'));
  expect('plan span follows the build', plan.gaps.some((g) => g.id === 'layout-minimap-span' && g.severity === 'follow'));
  expect('bundle plan is not a frozen-world redesign', !plan.gaps.some((g) => g.id === 'frozen-world'));
  expect('bundle build is not a frozen-world redesign', !boulevards.gaps.some((g) => g.id === 'frozen-world'));

  const sampler = checkOne({
    pr: 81,
    title: 'style sampler',
    branch: 'cursor/style-sampler-52fc',
    files: [
      { status: 'A', path: 'world/style-sampler.js' },
      { status: 'M', path: 'world.html' },
      { status: 'M', path: 'world-split.html' }
    ],
    pages: {
      world: '<script src="world/style-sampler.js?v=31"></script>',
      split: '<script src="world/style-sampler.js?v=31"></script>'
    },
    versionHead: { world: '31', stamp: '2', sw: 'b' },
    versionBase: { world: '30', stamp: '1', sw: 'a' }
  });
  expect('style sampler stays on the current world', !sampler.gaps.some((g) => g.id === 'frozen-world'));

  const dropTool = checkOne({
    pr: 87,
    title: 'room place',
    branch: 'cursor/room-place-hook-52fc',
    files: [
      { status: 'A', path: 'world/planner-props.js' },
      { status: 'A', path: 'docs/ROOM-PLACE-HOOK.md' },
      { status: 'A', path: 'world/style-sampler.js' },
      { status: 'M', path: 'world.html' },
      { status: 'M', path: 'world-split.html' }
    ],
    pages: {
      world: '<script src="world/planner-props.js?v=33"></script><script src="world/style-sampler.js?v=33"></script>',
      split: '<script src="world/planner-props.js?v=33"></script><script src="world/style-sampler.js?v=33"></script>'
    },
    versionHead: { world: '33', stamp: '2', sw: 'b' },
    versionBase: { world: '30', stamp: '1', sw: 'a' }
  });
  expect('drop-objects tool stays on the current world', !dropTool.gaps.some((g) => g.id === 'frozen-world'));

  const interiorsPlan = checkOne({
    pr: 74,
    title: 'interiors',
    branch: 'cursor/interiors-plan-52fc',
    files: [
      { status: 'A', path: 'docs/INTERIORS-PLAN.md' },
      { status: 'A', path: 'docs/interiors/builder-a-daylight.jpg' }
    ]
  });
  expect('interiors plan stays on the current world', !interiorsPlan.gaps.some((g) => g.id === 'frozen-world'));

  const plannerPlan = checkOne({
    pr: 82,
    title: 'planner',
    branch: 'cursor/planner-port-plan-cbd5',
    files: [
      { status: 'A', path: 'docs/PLANNER-PORT-PLAN.md' },
      { status: 'A', path: 'docs/planner/PROP-CATALOG.json' },
      { status: 'A', path: 'test/planner-port/catalog.js' }
    ],
    fileTexts: {
      'docs/PLANNER-PORT-PLAN.md': 'The design tool is the planner editor. Builder HQ design tool only.\nbakeBuilding(doc) exports a new shell.\n'
    }
  });
  expect('builder tool must leave the frozen world', plannerPlan.gaps.some((g) => g.id === 'frozen-world' && /builders/.test(g.detail) && /building redesign/.test(g.detail)));

  const catalogOnly = checkOne({
    pr: 82,
    title: 'catalog only',
    files: [
      { status: 'A', path: 'docs/planner/PROP-CATALOG.json' },
      { status: 'A', path: 'test/planner-port/catalog.js' }
    ]
  });
  expect('drop catalog alone is not a redesign', !catalogOnly.gaps.some((g) => g.id === 'frozen-world'));

  const glCity = checkOne({
    pr: 59,
    title: 'gl city',
    branch: 'cursor/split-webgl-58d4',
    files: [
      { status: 'A', path: 'world/gl-city.js' },
      { status: 'M', path: 'world-split.html' }
    ],
    pages: {
      world: '<script src="world/boot.js?v=30"></script>',
      split: '<script src="world/gl-city.js?v=30"></script>'
    },
    versionHead: { world: '31', stamp: '2', sw: 'b' },
    versionBase: { world: '30', stamp: '1', sw: 'a' }
  });
  expect('gl-city is a building redesign', glCity.gaps.some((g) => g.id === 'frozen-world' && /building redesign/.test(g.detail)));

  const fps = checkOne({
    pr: 56,
    title: 'fps',
    branch: 'cursor/ipad-fps-9e5c',
    files: [{ status: 'M', path: 'world/boot.js' }, { status: 'M', path: 'world.html' }],
    pages: { world: '<script src="world/boot.js?v=30"></script>', split: '<script src="world/boot.js?v=30"></script>' },
    versionHead: { world: '31', stamp: '2', sw: 'b' },
    versionBase: { world: '30', stamp: '1', sw: 'a' }
  });
  expect('fps fix stays on the frozen world', !fps.gaps.some((g) => g.id === 'frozen-world'));

  const nextWorld = checkOne({
    pr: 90,
    title: 'new world',
    branch: 'cursor/world-next-example',
    files: [
      { status: 'A', path: 'world-builder.html' },
      { status: 'A', path: 'world/planner-props.js' }
    ],
    keyDiff: "-  const KEY='zdash.kid.v1';\n+  const KEY='zdash.kid.v2';\n",
    versionHead: { world: '31', stamp: '2', sw: 'b' },
    versionBase: { world: '30', stamp: '1', sw: 'a' }
  });
  expect('new world page is not the frozen pages', !nextWorld.gaps.some((g) => g.id === 'frozen-world'));
  expect('new world page keeps shared saves', nextWorld.gaps.some((g) => g.id === 'shared-saves' && /zdash\.kid\.v1/.test(g.detail) && /zdash\.kid\.v2/.test(g.detail)));

  const nextOk = checkOne({
    pr: 91,
    title: 'new world keeps keys',
    files: [{ status: 'A', path: 'world-builder.html' }, { status: 'A', path: 'world/style-sampler.js' }],
    keyDiff: "+  const KEY='zdash.kid.v1';\n",
    versionHead: { world: '31', stamp: '2', sw: 'b' },
    versionBase: { world: '30', stamp: '1', sw: 'a' }
  });
  expect('shared keys on the new page are clean', !nextOk.gaps.some((g) => g.id === 'shared-saves' || g.id === 'frozen-world'));

  const mapDoc = fs.readFileSync(path.join(ROOT, 'docs/INTEGRATION-MAP.md'), 'utf8');
  Object.keys(OWNERS).forEach((id) => {
    expect('map mentions ' + OWNERS[id].title, mapDoc.indexOf(OWNERS[id].title) !== -1);
  });
  ['world.html', 'world-split.html', 'PROP-CATALOG', 'ZD_WORLD', 'index.html'].forEach((token) => {
    expect('map mentions ' + token, mapDoc.indexOf(token) !== -1);
  });

  if (failures.length) {
    console.error('integration-check self-test failed:');
    failures.forEach((f) => console.error('  - ' + f));
    process.exit(1);
  }
  console.log('integration-check self-test: passed');
}

function parseArgs(argv) {
  const out = { pr: null, branch: '', open: false, out: '', self: false, base: 'origin/main', json: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--self-test') out.self = true;
    else if (a === '--open') out.open = true;
    else if (a === '--json') out.json = true;
    else if (a === '--pr') out.pr = Number(argv[++i]);
    else if (a === '--branch') out.branch = argv[++i];
    else if (a === '--out') out.out = argv[++i];
    else if (a === '--base') out.base = argv[++i];
    else if (a === '--help' || a === '-h') out.help = true;
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || (!args.self && !args.open && !args.pr && !args.branch)) {
    console.log('Usage: node tools/integration-check.js --self-test | --pr N | --branch ref | --open [--out dir] [--base origin/main]');
    if (args.help) return;
    if (!args.self && !args.open && !args.pr && !args.branch) process.exit(2);
  }
  if (args.self) {
    runSelfTest();
    if (!args.open && !args.pr && !args.branch) return;
  }
  if (args.open) {
    const { rows } = runOpen(args.base, args.out ? path.resolve(ROOT, args.out) : path.join(ROOT, 'test-results/integration-check'));
    console.log(markdownTable(rows));
    return;
  }
  let meta = { pr: args.pr, title: '', branch: args.branch, url: '', agent: '' };
  if (args.pr && !args.branch) {
    const raw = execFileSync('gh', ['pr', 'view', String(args.pr), '--json', 'number,title,headRefName,url'], { cwd: ROOT, encoding: 'utf8' });
    const p = JSON.parse(raw);
    meta = { pr: p.number, title: p.title, branch: p.headRefName, url: p.url, agent: ownerAgentForBranch(p.headRefName) };
  }
  const report = loadBranch(meta, args.base);
  applyCross([report]);
  if (args.json) console.log(JSON.stringify(report, null, 2));
  else console.log(commentMarkdown(report));
  const now = report.gaps.some((g) => g.severity === 'gap');
  process.exit(now ? 1 : 0);
}

module.exports = {
  OWNERS,
  classify,
  checkOne,
  applyCross,
  commentMarkdown,
  tableRow,
  isRuntime,
  layoutGeometry,
  scriptSrcs
};

if (require.main === module) main();
