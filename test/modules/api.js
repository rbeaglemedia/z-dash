'use strict';
/* Mount contract for tools that live inside the Z-DASH Tools hub.
   Character Viewer (agent bc-fb37f92e) and later spinners register here.
   Drop-in: no hub change required once the module or its page exists.

   window.ZD_TOOL_MODULES[id] = {
     id: 'character',
     title: 'Character',
     mount: function (host, ctx) {
       // build into host. return a function that removes timers and DOM.
     }
   };

   ctx = {
     game: function () { return the game window (iframe or this window); },
     notify: function (err) {},
     open: function (url) {},
     asset: function (rel) { return absolute URL under /test/; },
     reapplyKills: true on the hub FPS tab, false on the in-game wrench
   };

   Character page fallback: test/viewer.html
   Expected viewer global, when that agent ships it:
     window.__VIEWER = { ready, setModel, setEq, setAngle, setCompare, toggle, anatomy, fps, shotDataURL }
   Favorites key they planned: zdash.viewer.favs.v1
   Ellie votes prefer __VIEWER.shotDataURL() for the thumbnail.

   Slots:
     character → ZD_TOOL_MODULES.character, else test/viewer.html
     car       → ZD_TOOL_MODULES.car, else test/car-spinner.html
     building  → ZD_TOOL_MODULES.building, else test/building-viewer.html
     builder   → ZD_TOOL_MODULES.builder, else test/builder.html
*/
(function (g) {
  if (!g.ZD_TOOL_MODULES) g.ZD_TOOL_MODULES = {};
  g.ZD_TOOL_API = {
    version: 1,
    fields: ['ready', 'setModel', 'setEq', 'setAngle', 'setCompare', 'toggle', 'anatomy', 'fps', 'shotDataURL']
  };
})(window);
