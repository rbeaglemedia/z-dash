# WebGL building bench

Stamp 2026-10-24T03:37:00.844Z. Chrome `--disable-gpu` (software WebGL).
`raf` is the whole frame with the player car stubbed out, so the number is the city pass. `bldg` is time inside `drawBldg` (2D solid, or 2D leftovers when `gl=1`). `compose` is submit + the WebGL draw. `blit` is 0: the GL canvas is on screen, not copied.
Five samples, first interval dropped. This VM is not a Galaxy or an A10.

| view | shot | canvas | 2D raf ms | 2D bldg ms | GL raf ms | GL bldg ms | GL compose ms | GL blit ms | buildings |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|
| phone | air | 1688x780 dpr 2 | 16.5 | 0.2 | 20.5 | 0.1 | 0.4 | 0 | 25 |
| phone | face | 1688x780 dpr 2 | 15.5 | 1.6 | 20.5 | 1.9 | 0.2 | 0 | 7 |
| phone | shops | 1688x780 dpr 2 | 16.3 | 0.5 | 24.1 | 0.4 | 0.5 | 0 | 19 |
| phone | glow | 1688x780 dpr 2 | 16.2 | 0.3 | 16.5 | 0.2 | 0.3 | 0 | 27 |
| ipad | air | 1024x768 dpr 1 | 14 | 0.2 | 15.3 | 0.1 | 0.1 | 0 | 15 |
| ipad | face | 1024x768 dpr 1 | 16.8 | 2.1 | 16.7 | 1.6 | 0.1 | 0 | 4 |
| ipad | shops | 1024x768 dpr 1 | 14 | 0.4 | 13.9 | 0.3 | 0.3 | 0 | 14 |
| ipad | glow | 1024x768 dpr 1 | 16.6 | 0.3 | 15.9 | 0.2 | 0.2 | 0 | 25 |
| pc | air | 1280x720 dpr 1 | 15.9 | 0.5 | 16.7 | 0.2 | 0.4 | 0 | 24 |
| pc | face | 1280x720 dpr 1 | 15.1 | 2 | 14.1 | 1.1 | 0.2 | 0 | 6 |
| pc | shops | 1280x720 dpr 1 | 13.2 | 0.5 | 13.9 | 0.2 | 0.3 | 0 | 19 |
| pc | glow | 1280x720 dpr 1 | 16.7 | 0.3 | 14.4 | 0.2 | 0.3 | 0 | 25 |

## WebGL

```json
{
  "webgl": "WebGL 1.0 (OpenGL ES 2.0 Chromium)",
  "limits": {
    "webgl1": true,
    "version": "WebGL 1.0 (OpenGL ES 2.0 Chromium)",
    "glsl": "WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)",
    "maxTexture": 8192,
    "maxAttribs": 16,
    "renderer": "ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)",
    "vendor": "Google Inc. (Google)"
  },
  "fallback": "",
  "error": "",
  "loadMs": 2695.3000000000466,
  "assetErr": ""
}
```
