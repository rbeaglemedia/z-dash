// Bootstrap for this export. Two modes share this shell:
// Builder (phase "build"): walls, the box shape, doors.
// Place objects (phase "place"): the catalog, with technology tagged in src/tech-tags.js.
// Venue picker, Run event, and quote are not started. Object study files live in objects/ and are not loaded here.
import { applyBrandCss } from './brand.js';
import './style.css';
applyBrandCss();
import './app/state.js';
import './app/view.js';
import './app/presets.js';
import './app/shell.js';
import './app/scene.js';
import './app/render.js';
import './app/place.js';
import './app/input.js';
import './app/levels.js';
import './app/clear.js';
import { ESP } from './app/runtime.js';
import { bootEmbed } from './embed.js';

// Venue drawing and crowd-fill drawing are not in this export. Rebuild still calls them.
if (typeof ESP.drawVenue !== 'function') ESP.drawVenue = function drawVenue() {};
if (typeof ESP.drawFill !== 'function') ESP.drawFill = function drawFill() {};

// Same startup the planner runs before the self-test hooks. The venue picker, quote, and Run event are not started. Editor tools are mapped in TOOLS.md.
ESP.saved0 = ESP.loadSaved();
ESP.saved0 && ESP.setMute(ESP.saved0.mute);
ESP.startUI();
ESP.renderPresets();
ESP.applyEnv();
ESP.resetView();
ESP.setPhase('build');
ESP.histReset();
ESP.viewUI();
ESP.stampUI();
bootEmbed();
