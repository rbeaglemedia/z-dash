#!/usr/bin/env python3
"""Building-look mockups. Not the game. No model files.

Designs stay on this branch. Placement stays with the City Layout
agent (bc-3ff1a27b). Do not draw a city map from this script.
"""
import math
import os
import sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(__file__), '..', 'test-results', 'gl-city', 'looks')
ART = '/opt/cursor/artifacts/gl-city/looks'
SIGN_FONT = '/usr/share/fonts/truetype/macos/Inter-Bold.ttf'

SKY_TOP = (5, 2, 12)
SKY_MID = (42, 6, 54)
HORIZON = (255, 42, 61)
GROUND = (8, 2, 10)
CYAN = (62, 230, 255)
MAG = (255, 79, 216)
AMBER = (255, 225, 77)
GREEN = (125, 255, 107)
GLASS = (22, 14, 48)
GLASS_HI = (48, 28, 82)

VIEWS = [
    ('phone', 844, 390),
    ('ipad', 1024, 768),
    ('pc', 1366, 768),
]


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def sky(img):
    w, h = img.size
    px = img.load()
    hy = int(h * 0.58)
    for y in range(h):
        if y < hy:
            t = y / max(1, hy)
            c = lerp(SKY_TOP, SKY_MID, t * 0.85)
            if t > 0.72:
                c = lerp(c, HORIZON, (t - 0.72) / 0.28)
        else:
            t = (y - hy) / max(1, h - hy)
            c = lerp((26, 4, 16), GROUND, min(1, t * 1.4))
        for x in range(w):
            px[x, y] = c
    dr = ImageDraw.Draw(img)
    dr.line([(0, hy), (w, hy)], fill=HORIZON, width=2)
    return hy


def grid(dr, w, h, hy):
    for i in range(-8, 12):
        x0 = int(w * 0.5 + i * 70)
        dr.line([(x0, hy), (int(w * 0.5 + i * 220), h)], fill=(90, 20, 110), width=1)


def shade(c, k):
    return tuple(max(0, min(255, int(v * k))) for v in c)


def draw_label(dr, text, cx, cy, box_w, box_h, fill):
    """Center a word in a screen-space box, sized so the purpose stays readable."""
    if not text or box_w < 8 or box_h < 8:
        return
    size = int(min(box_h * 0.72, 72))
    size = max(8, size)
    font = ImageFont.truetype(SIGN_FONT, size)
    bb = font.getbbox(text)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    while size > 8 and (tw > box_w * 0.92 or th > box_h * 0.9):
        size -= 1
        font = ImageFont.truetype(SIGN_FONT, size)
        bb = font.getbbox(text)
        tw, th = bb[2] - bb[0], bb[3] - bb[1]
    dr.text((cx - tw / 2.0, cy - th / 2.0 - bb[1]), text, fill=fill, font=font)


TIER = 'arcade'
MS = {
    ('a', 'arcade'): 'Arcade est. 0.4-1.2 ms',
    ('a', 'street'): 'Street est. 0.7-2.0 ms',
    ('b', 'arcade'): 'Arcade est. 0.8-2.0 ms atlased',
    ('b', 'street'): 'Street est. 2-6 ms if materials split',
    ('c', 'arcade'): 'Arcade est. 0.5-1.6 ms',
    ('c', 'street'): 'Street est. 0.8-2.5 ms',
}


def win_atlas(dr, poly, kind):
    xs = [p[0] for p in poly]
    ys = [p[1] for p in poly]
    x0, x1 = int(min(xs)) + 4, int(max(xs)) - 4
    y0, y1 = int(min(ys)) + 4, int(max(ys)) - 4
    if x1 - x0 < 12 or y1 - y0 < 16:
        return
    col = 0
    row_h = 7 if (y1 - y0) > 80 else 5
    y = y0
    row = 0
    while y < y1 - 3:
        # Arcade keeps a sparse window grid. Street fills the same wall.
        if TIER == 'arcade' and row % 2:
            y += row_h
            row += 1
            col += 1
            continue
        x = x0
        cyc = 0
        while x < x1 - 3:
            if kind == 'pastel':
                color = (32, 40, 52) if (col + cyc) % 3 else (48, 56, 68)
                ww, hh = 6, row_h - 2
            else:
                pick = (col * 3 + cyc) % 7
                if pick == 0:
                    color = MAG
                elif pick == 1:
                    color = AMBER
                elif pick == 2:
                    color = GREEN
                else:
                    color = CYAN
                if (col + cyc) % 5 == 0:
                    x += 8
                    cyc += 1
                    continue
                ww, hh = 5, max(2, row_h - 3)
            dr.rectangle([x, y, x + ww, y + hh], fill=color)
            x += 16 if TIER == 'arcade' else 8
            cyc += 1
        y += row_h
        row += 1
        col += 1


def face(dr, pts, fill, kind, trim):
    dr.polygon(pts, fill=fill)
    if kind != 'pastel':
        win_atlas(dr, pts, kind)
    else:
        win_atlas(dr, pts, 'pastel')
    if trim and kind != 'pastel':
        dr.line(pts + [pts[0]], fill=trim, width=2)


def box(dr, proj, x, z, w, d, h, kind='glass'):
    y0, y1 = 0, h
    corners = []
    for yy in (y0, y1):
        for xx, zz in ((x, z), (x + w, z), (x + w, z + d), (x, z + d)):
            corners.append(proj(xx, yy, zz))
    # 0-3 bottom, 4-7 top
    def quad(ids, fill, trim):
        pts = [corners[i] for i in ids]
        if sum((pts[(i + 1) % 4][0] - pts[i][0]) * (pts[(i + 1) % 4][1] + pts[i][1]) for i in range(4)) > 0:
            return
        face(dr, pts, fill, kind, trim)

    if kind == 'pastel':
        wall, side, roof, trim = (232, 214, 184), (198, 176, 150), (214, 122, 106), None
    else:
        wall, side, roof, trim = GLASS_HI, GLASS, shade(CYAN, 0.35), CYAN
    # painter: +z is farther if camera looks toward -z? We'll pass camera in front (small z).
    quad((0, 1, 5, 4), wall, trim)       # front z
    quad((1, 2, 6, 5), side, MAG if kind != 'pastel' else None)
    quad((4, 5, 6, 7), roof, CYAN if kind != 'pastel' else None)
    quad((3, 0, 4, 7), side, trim)


def house(dr, proj, x, z, w, d, h):
    box(dr, proj, x, z, w, d, h, 'glass')
    a = proj(x - 1, h, z - 1)
    b = proj(x + w + 1, h, z - 1)
    c = proj(x + w + 1, h, z + d + 1)
    e = proj(x - 1, h, z + d + 1)
    ridge_l = proj(x + w * 0.15, h + w * 0.45, z + d * 0.5)
    ridge_r = proj(x + w * 0.85, h + w * 0.45, z + d * 0.5)
    dr.polygon([a, b, ridge_r, ridge_l], fill=(90, 16, 48))
    dr.polygon([b, c, ridge_r], fill=(60, 10, 36))
    dr.line([a, ridge_l, ridge_r, b], fill=MAG, width=2)
    door = [proj(x + w * 0.4, 0, z - 0.2), proj(x + w * 0.6, 0, z - 0.2),
            proj(x + w * 0.6, h * 0.35, z - 0.2), proj(x + w * 0.4, h * 0.35, z - 0.2)]
    dr.polygon(door, fill=GREEN)


def spire(dr, proj, x, z, w, h):
    box(dr, proj, x, z, w, w, h * 0.72, 'glass')
    top = h
    tip = proj(x + w * 0.5, top + h * 0.28, z + w * 0.5)
    base = [proj(x, h * 0.72, z), proj(x + w, h * 0.72, z), proj(x + w, h * 0.72, z + w), proj(x, h * 0.72, z + w)]
    dr.polygon([base[0], base[1], tip], fill=(30, 18, 64))
    dr.polygon([base[1], base[2], tip], fill=(18, 10, 40))
    dr.line([base[0], tip, base[1]], fill=CYAN, width=2)
    mast = proj(x + w * 0.5, top + h * 0.42, z + w * 0.5)
    dr.line([tip, mast], fill=CYAN, width=2)


def stadium(dr, proj, x, z, w, d):
    box(dr, proj, x, z, w, d, 8, 'glass')
    rim_a = proj(x, 8, z)
    rim_b = proj(x + w, 8, z)
    dr.line([rim_a, rim_b], fill=AMBER, width=3)


def door(dr, proj, x, z, w, h):
    # Same door in Arcade and Street. Only the surface around it changes.
    quad = [proj(x + w * 0.38, 0, z - 0.15), proj(x + w * 0.62, 0, z - 0.15),
            proj(x + w * 0.62, h * 0.28, z - 0.15), proj(x + w * 0.38, h * 0.28, z - 0.15)]
    dr.polygon(quad, fill=(20, 8, 16))
    dr.line(quad + [quad[0]], fill=CYAN, width=2)


def garage(dr, proj, x, z, w, h):
    # Same garage opening in both tiers.
    quad = [proj(x + w * 0.12, 0, z - 0.15), proj(x + w * 0.48, 0, z - 0.15),
            proj(x + w * 0.48, h * 0.22, z - 0.15), proj(x + w * 0.12, h * 0.22, z - 0.15)]
    dr.polygon(quad, fill=(16, 10, 22))
    dr.line(quad + [quad[0]], fill=AMBER, width=2)


def roof_cap(dr, proj, x, z, w, d, h, color):
    # Static baked roof mark. Drawn the same in Arcade and Street (flying still sees it).
    y = h + 0.2
    quad = [proj(x + w * 0.18, y, z + d * 0.38), proj(x + w * 0.82, y, z + d * 0.38),
            proj(x + w * 0.82, y, z + d * 0.62), proj(x + w * 0.18, y, z + d * 0.62)]
    dr.polygon(quad, fill=color)


def mix(p, q, t):
    return (p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t)


def bilerp(quad, u, v):
    # quad: (u0,v0), (u1,v0), (u1,v1), (u0,v1)
    return mix(mix(quad[0], quad[1], u), mix(quad[3], quad[2], u), v)


def dance(dr, proj, tier, kind, shape='box', origin=None):
    # One flat mural wall, same size and facing in every shape. Extra mass sits behind it.
    if origin is None:
        x, z, w, d, h = 6, -6, 12, 5, 10
    else:
        x, z, w, d, h = origin
    wall = (36, 12, 32) if kind != 'b' else (196, 150, 148)
    style = 'pastel' if kind == 'b' else 'glass'
    if shape == 'shoulder':
        box(dr, proj, x + w * 0.62, z - d * 0.55, w * 0.55, d * 1.15, h * 1.38, style)
    elif shape == 'crown':
        box(dr, proj, x + w * 0.24, z - d * 0.7, w * 0.52, d * 0.85, h * 1.55, style)
    box(dr, proj, x, z, w, d, h, style)
    front = [proj(x, 0, z + 0.05), proj(x + w, 0, z + 0.05),
             proj(x + w, h, z + 0.05), proj(x, h, z + 0.05)]
    dr.polygon(front, fill=wall)
    # Same fractions muralFrame uses on the 18 m Arts box: y0 3.2, height 9.9, 92% of the face.
    y0 = h * (3.2 / 18.0)
    y1 = h * ((3.2 + 9.9) / 18.0)
    x0 = x + w * 0.04
    x1 = x + w * 0.96
    mz = z + 0.12
    # Trim, sign, and entrance sit outside the mural quad. The mural is painted last.
    trim_w = 2 if tier == 'arcade' else 4
    dr.line(front + [front[0]], fill=MAG, width=trim_w)
    sign = [proj(x0, y1 + 0.15, mz), proj(x1, y1 + 0.15, mz),
            proj(x1, min(h - 0.3, y1 + 0.7), mz), proj(x0, min(h - 0.3, y1 + 0.7), mz)]
    dr.polygon(sign, fill=(12, 4, 20) if tier == 'arcade' else MAG)
    dr.line(sign + [sign[0]], fill=CYAN, width=2)
    roof_cap(dr, proj, x, z, w, d, h, CYAN if kind != 'b' else (180, 90, 78))
    mast = proj(x + w * 0.72, h, z + d * 0.5)
    tip = proj(x + w * 0.72, h + 1.6, z + d * 0.5)
    dr.line([mast, tip], fill=CYAN, width=2)
    # Side face runs away from the camera (toward -z), behind the mural plane.
    zs = z - d * 0.42
    ze = z - d * 0.72
    side = [proj(x - 0.05, 0, zs), proj(x - 0.05, 0, ze),
            proj(x - 0.05, h * 0.28, ze), proj(x - 0.05, h * 0.28, zs)]
    dr.polygon(side, fill=(20, 8, 16))
    dr.line(side + [side[0]], fill=CYAN, width=2)
    if tier == 'street':
        y = h * 0.32
        lip = [proj(x, y, zs), proj(x, y, ze),
               proj(x - 1.4, y - 0.35, ze - 0.05), proj(x - 1.4, y - 0.35, zs + 0.05)]
        dr.polygon(lip, fill=MAG)
        dr.line(lip + [lip[0]], fill=MAG, width=2)
    mural = [proj(x0, y0, mz), proj(x1, y0, mz), proj(x1, y1, mz), proj(x0, y1, mz)]
    dr.polygon(mural, fill=(22, 11, 40))

    def mpt(u, v):
        return bilerp(mural, u, v)

    def mline(pts, fill, width):
        dr.line([mpt(u, v) for u, v in pts], fill=fill, width=width)

    mline([(0.12, 0.78), (0.40, 0.78), (0.12, 0.28), (0.40, 0.28)], CYAN, 3)
    mline([(0.52, 0.62), (0.52, 0.40)], MAG, 3)
    mline([(0.40, 0.56), (0.52, 0.62), (0.66, 0.52)], MAG, 3)
    mline([(0.52, 0.40), (0.42, 0.22)], CYAN, 3)
    mline([(0.52, 0.40), (0.64, 0.22)], AMBER, 3)
    head = mpt(0.52, 0.74)
    span = abs(mural[1][0] - mural[0][0])
    rad = max(3, int(span * 0.028))
    dr.ellipse([head[0] - rad, head[1] - rad, head[0] + rad, head[1] + rad], outline=MAG, width=2)
    band = [mpt(0.02, 0.86), mpt(0.98, 0.86), mpt(0.98, 0.98), mpt(0.02, 0.98)]
    dr.polygon(band, fill=(6, 2, 16))
    dr.line(band + [band[0]], fill=CYAN, width=2)
    label = mpt(0.50, 0.92)
    word = 'Z COMPANY ARTS' if span > 150 else 'Z ARTS'
    tw = 52 if span > 150 else 22
    dr.text((label[0] - tw, label[1] - 6), word, fill=CYAN)
    dr.line(mural + [mural[0]], fill=MAG, width=3)


def awning(dr, proj, x, z, w, h, color):
    y = h * 0.34
    quad = [proj(x + w * 0.2, y, z - 0.1), proj(x + w * 0.8, y, z - 0.1),
            proj(x + w * 0.84, y - 1.2, z - 2.2), proj(x + w * 0.16, y - 1.2, z - 2.2)]
    dr.polygon(quad, fill=color)
    dr.line(quad + [quad[0]], fill=color, width=2)


def scene(kind, w, h, tier):
    global TIER
    TIER = tier
    img = Image.new('RGB', (w, h))
    hy = sky(img)
    dr = ImageDraw.Draw(img)
    grid(dr, w, h, hy)
    cam_z = 18

    def proj(x, y, z):
        zz = cam_z - z
        if zz < 0.4:
            zz = 0.4
        f = h * 0.85
        return (w * 0.50 + x * f / zz, hy - y * f / zz)

    # back to front (larger z first). Caps sit on the same boxes in both tiers.
    caps = []
    if kind == 'a':
        specs = [(-26, -40, 10, 8, 28), (-12, -38, 12, 9, 46), (4, -42, 14, 10, 34),
                 (22, -36, 9, 8, 22), (-8, -18, 8, 7, 16)]
        caps = specs
        for s in specs:
            box(dr, proj, *s, 'glass')
    elif kind == 'b':
        specs = [(-26, -40, 10, 8, 22), (-12, -38, 12, 9, 30), (4, -42, 14, 10, 26),
                 (22, -36, 9, 8, 18), (-8, -18, 8, 7, 12)]
        caps = specs
        for s in specs:
            box(dr, proj, *s, 'pastel')
    else:
        caps = [(-28, -44, 9, 8, 24), (2, -42, 12, 9, 30), (18, -36, 8, 7, 18)]
        box(dr, proj, -28, -44, 9, 8, 24, 'glass')
        spire(dr, proj, -14, -48, 8, 52)
        box(dr, proj, 2, -42, 12, 9, 30, 'glass')
        box(dr, proj, 18, -36, 8, 7, 18, 'glass')
        house(dr, proj, -10, -16, 9, 7, 11)
        stadium(dr, proj, -24, -22, 12, 7)
    # Doors, garages, and the baked roof cap match. Street only adds the storefront.
    # Z dance: one full mural wall. The shape around it follows the look.
    door(dr, proj, -8, -18, 8, 16)
    if kind == 'c':
        garage(dr, proj, 18, -36, 8, 7)
    else:
        garage(dr, proj, 22, -36, 9, 8)
    cap = CYAN if kind != 'b' else (180, 90, 78)
    for spec in caps:
        roof_cap(dr, proj, spec[0], spec[1], spec[2], spec[3], spec[4], cap)
    if tier == 'street':
        awning(dr, proj, -8, -18, 8, 16, AMBER)
    dance_shape = {'a': 'box', 'b': 'shoulder', 'c': 'crown'}[kind]
    dance(dr, proj, tier, kind, dance_shape)
    titles = {
        'a': '(a) procedural  DANCE box',
        'b': '(b) free kit  DANCE shoulder',
        'c': '(c) hybrid  DANCE crown',
    }
    tier_name = 'ARCADE  lighter trim' if tier == 'arcade' else 'STREET  richer trim'
    bar_h = 54 if h < 500 else 62
    dr.rectangle([0, h - bar_h, w, h], fill=(8, 2, 16))
    dr.text((12, h - bar_h + 6), 'MOCKUP  ' + titles[kind] + '   ' + tier_name, fill=(233, 227, 228))
    dr.text((12, h - bar_h + 22), MS[(kind, tier)] + '   building pass only, not measured on a phone', fill=(62, 230, 255))
    dr.text((12, h - bar_h + 36), 'Z DANCE keeps one full flat mural wall. Facing unchanged.', fill=(138, 122, 125))
    return img


def options_scene(tier, w, h):
    """Three legal Z dance shapes. The mural wall is the same size and facing in each."""
    global TIER
    TIER = tier
    img = Image.new('RGB', (w, h))
    hy = sky(img)
    dr = ImageDraw.Draw(img)
    grid(dr, w, h, hy)
    cam_z = 18

    def proj(x, y, z):
        zz = cam_z - z
        if zz < 0.4:
            zz = 0.4
        f = h * 0.85
        return (w * 0.50 + x * f / zz, hy - y * f / zz)

    # Left to right: box, shoulder, crown. Same mural-wall footprint.
    slots = [
        (-16, -6, 8, 4, 8, 'box'),
        (-4, -6, 8, 4, 8, 'shoulder'),
        (8, -6, 8, 4, 8, 'crown'),
    ]
    for spec in slots:
        dance(dr, proj, tier, 'a', spec[5], spec[:5])
        name = spec[5].upper()
        foot = proj(spec[0] + spec[2] * 0.5, 0, spec[1] + 0.2)
        dr.text((foot[0] - 28, min(h - 70, foot[1] + 8)), name, fill=(233, 227, 228))
    tier_name = 'ARCADE  lighter trim around the wall' if tier == 'arcade' else 'STREET  richer trim around the wall'
    bar_h = 54 if h < 500 else 62
    dr.rectangle([0, h - bar_h, w, h], fill=(8, 2, 16))
    dr.text((12, h - bar_h + 6), 'Z DANCE OPTIONS   BOX  ·  SHOULDER  ·  CROWN    ' + tier_name, fill=(233, 227, 228))
    dr.text((12, h - bar_h + 22), 'Same mural, same facing. The flat wall stays full size.', fill=(62, 230, 255))
    dr.text((12, h - bar_h + 36), 'Extra mass sits behind that wall. Not in the game.', fill=(138, 122, 125))
    return img


# Architecture Check standard shots (bc-c7ace59c). Four views, three viewports.
# Street front and three-quarter use the Street surface. Roof/flying uses Arcade.
# On-foot close-up uses the on-foot surface. The mural wall is the same in all of them.
REVIEW_VIEWS = [
    ('phone', 844, 390),
    ('ipad', 1024, 768),
    ('pc', 1280, 720),
]
REVIEW_SHOTS = (
    ('front', 'street', 'STREET FRONT'),
    ('threeq', 'street', 'THREE-QUARTER'),
    ('roof', 'arcade', 'ROOF / FLYING'),
    ('foot', 'onfoot', 'ON-FOOT CLOSE-UP'),
)
# Arts & Garage stand-in: east mural wall 64 m wide by 18 m tall. +z faces the street.
WALL_X0, WALL_X1, WALL_H, WALL_Z, WALL_D = -32.0, 32.0, 18.0, 0.0, 16.0


def look_proj(w, h, eye, target, fov=52):
    ex, ey, ez = eye
    fx, fy, fz = target[0] - ex, target[1] - ey, target[2] - ez
    fl = math.hypot(fx, fy, fz) or 1.0
    fx, fy, fz = fx / fl, fy / fl, fz / fl
    rx, ry, rz = -fz, 0.0, fx
    rl = math.hypot(rx, ry, rz) or 1.0
    rx, ry, rz = rx / rl, ry / rl, rz / rl
    ux = ry * fz - rz * fy
    uy = rz * fx - rx * fz
    uz = rx * fy - ry * fx
    focal = (h * 0.5) / math.tan(math.radians(fov) * 0.5)

    def proj(x, y, z):
        dx, dy, dz = x - ex, y - ey, z - ez
        depth = dx * fx + dy * fy + dz * fz
        if depth < 0.35:
            depth = 0.35
        sx = dx * rx + dy * ry + dz * rz
        sy = dx * ux + dy * uy + dz * uz
        return (w * 0.5 + sx * focal / depth, h * 0.5 - sy * focal / depth)

    return proj


def shot_cameras(w, h):
    focal = (h * 0.5) / math.tan(math.radians(52) * 0.5)
    depth = 32.0 * focal / (0.36 * w)
    depth = max(28.0, min(64.0, depth))
    return {
        'front': ((0.0, 2.2, depth), (0.0, 8.0, 0.0)),
        'threeq': ((depth * 0.75, max(3.0, WALL_H * 0.15), depth * 0.62), (0.0, 8.0, -4.0)),
        'roof': ((14.0, WALL_H + max(12.0, WALL_H * 0.35), 24.0), (0.0, 16.0, -8.0)),
        'foot': ((-30.2, 1.65, 6.2), (-30.6, 2.6, 0.15)),
    }


def cull_face(dr, proj, pts, fill, outline=None, width=2):
    poly = [proj(*p) for p in pts]
    area = 0.0
    for i in range(len(poly)):
        x0, y0 = poly[i]
        x1, y1 = poly[(i + 1) % len(poly)]
        area += (x1 - x0) * (y1 + y0)
    if area > 0:
        return None
    dr.polygon(poly, fill=fill)
    if outline:
        dr.line(poly + [poly[0]], fill=outline, width=width)
    return poly


def window_grid(dr, proj, x0, x1, y0, y1, z, tier):
    step = 4.2 if tier == 'arcade' else 2.4
    y = y0
    row = 0
    while y < y1 - 1.2:
        if tier == 'arcade' and row % 2:
            y += step * 0.7
            row += 1
            continue
        x = x0
        col = 0
        while x < x1 - 1.2:
            if (row + col) % 5 == 0:
                x += step
                col += 1
                continue
            color = CYAN if (row + col) % 3 else MAG
            cull_face(dr, proj, [
                (x, y, z), (x + 1.1, y, z), (x + 1.1, y + 1.4, z), (x, y + 1.4, z)
            ], color)
            x += step
            col += 1
        y += step * 0.75
        row += 1


def paint_mural(dr, quad):
    dr.polygon(quad, fill=(22, 11, 40))

    def mpt(u, v):
        return bilerp(quad, u, v)

    def mline(pts, fill, width):
        dr.line([mpt(u, v) for u, v in pts], fill=fill, width=width)

    mline([(0.12, 0.78), (0.40, 0.78), (0.12, 0.28), (0.40, 0.28)], CYAN, 3)
    mline([(0.52, 0.62), (0.52, 0.40)], MAG, 3)
    mline([(0.40, 0.56), (0.52, 0.62), (0.66, 0.52)], MAG, 3)
    mline([(0.52, 0.40), (0.42, 0.22)], CYAN, 3)
    mline([(0.52, 0.40), (0.64, 0.22)], AMBER, 3)
    head = mpt(0.52, 0.74)
    span = abs(quad[1][0] - quad[0][0])
    rad = max(2, int(span * 0.03))
    dr.ellipse([head[0] - rad, head[1] - rad, head[0] + rad, head[1] + rad], outline=MAG, width=2)
    band = [mpt(0.02, 0.86), mpt(0.98, 0.86), mpt(0.98, 0.98), mpt(0.02, 0.98)]
    dr.polygon(band, fill=(6, 2, 16))
    dr.line(band + [band[0]], fill=CYAN, width=2)
    label = mpt(0.50, 0.92)
    word = 'Z COMPANY ARTS' if span > 160 else 'Z ARTS'
    band_h = abs(mpt(0.50, 0.86)[1] - mpt(0.50, 0.98)[1])
    draw_label(dr, word, label[0], label[1], span * 0.86, max(12, band_h), CYAN)
    dr.line(quad + [quad[0]], fill=MAG, width=3)


def review_frame(shape, view, tier, w, h, title):
    img = Image.new('RGB', (w, h))
    sky(img)
    dr = ImageDraw.Draw(img)
    eye, target = shot_cameras(w, h)[view]
    proj = look_proj(w, h, eye, target)
    for i in range(-9, 10):
        x = i * 5.0
        dr.line([proj(x, 0.02, -6), proj(x, 0.02, 42)], fill=(48, 18, 58), width=1)
    for i in range(0, 9):
        z = i * 5.0
        dr.line([proj(-48, 0.02, z), proj(48, 0.02, z)], fill=(48, 18, 58), width=1)
    # Extra mass is behind the mural wall. Same footprint at every tier.
    if shape == 'shoulder':
        cull_face(dr, proj, [(14, 0, -5), (36, 0, -5), (36, 26, -5), (14, 26, -5)], (32, 14, 40), MAG, 2)
        cull_face(dr, proj, [(36, 0, -5), (36, 0, -22), (36, 26, -22), (36, 26, -5)], (24, 10, 32))
        cull_face(dr, proj, [(14, 26, -5), (36, 26, -5), (36, 26, -22), (14, 26, -22)], (18, 8, 28))
        window_grid(dr, proj, 32.4, 35.2, 2.0, 24.0, -4.85, tier)
    elif shape == 'crown':
        cull_face(dr, proj, [(-14, 0, -7), (14, 0, -7), (14, 30, -7), (-14, 30, -7)], (32, 14, 40), CYAN, 2)
        cull_face(dr, proj, [(14, 0, -7), (14, 0, -20), (14, 30, -20), (14, 30, -7)], (24, 10, 32))
        cull_face(dr, proj, [(-14, 30, -7), (14, 30, -7), (14, 30, -20), (-14, 30, -20)], (18, 8, 28))
        window_grid(dr, proj, -12.0, 12.0, 19.2, 28.5, -6.85, tier)
    # Flat mural wall, 64 m by 18 m, same facing in every shot.
    zf = WALL_Z
    cull_face(dr, proj, [
        (WALL_X0, 0, zf), (WALL_X1, 0, zf), (WALL_X1, WALL_H, zf), (WALL_X0, WALL_H, zf)
    ], (36, 12, 32), MAG, 2 if tier == 'arcade' else 4)
    cull_face(dr, proj, [
        (WALL_X1, 0, zf), (WALL_X1, 0, zf - WALL_D), (WALL_X1, WALL_H, zf - WALL_D), (WALL_X1, WALL_H, zf)
    ], (26, 10, 28))
    cull_face(dr, proj, [
        (WALL_X0, 0, zf - WALL_D), (WALL_X0, 0, zf), (WALL_X0, WALL_H, zf), (WALL_X0, WALL_H, zf - WALL_D)
    ], (26, 10, 28))
    cull_face(dr, proj, [
        (WALL_X0, WALL_H, zf), (WALL_X1, WALL_H, zf), (WALL_X1, WALL_H, zf - WALL_D), (WALL_X0, WALL_H, zf - WALL_D)
    ], (20, 8, 24))
    roof_z = zf - 0.4
    cull_face(dr, proj, [
        (-22, WALL_H + 0.25, roof_z), (22, WALL_H + 0.25, roof_z),
        (22, WALL_H + 0.25, roof_z - 6), (-22, WALL_H + 0.25, roof_z - 6)
    ], CYAN)
    dr.line([proj(18, WALL_H, -6), proj(18, WALL_H + 3.2, -6)], fill=CYAN, width=2)
    # Person door in the left margin, below the mural. 1.2 m by 2.3 m, y starts at 0.
    door = [(-31.6, 0, 0.16), (-30.4, 0, 0.16), (-30.4, 2.3, 0.16), (-31.6, 2.3, 0.16)]
    cull_face(dr, proj, door, (20, 8, 16), CYAN, 2)
    if tier != 'arcade':
        cull_face(dr, proj, [
            (-31.8, 2.45, 0.2), (-30.2, 2.45, 0.2), (-30.0, 2.15, 1.5), (-32.0, 2.15, 1.5)
        ], MAG)
    sign_fill = (12, 4, 20) if tier == 'arcade' else MAG
    cull_face(dr, proj, [
        (-29.4, 13.5, 0.18), (29.4, 13.5, 0.18), (29.4, 15.6, 0.18), (-29.4, 15.6, 0.18)
    ], sign_fill, CYAN, 2)
    # Scale props. Person 1.7 m, pet 0.74 m, car 4.25 x 1.85 x 1.32 m.
    cull_face(dr, proj, [(-29.3, 0, 3.1), (-28.8, 0, 3.1), (-28.8, 1.7, 3.1), (-29.3, 1.7, 3.1)], (233, 227, 228), CYAN, 1)
    cull_face(dr, proj, [(-27.6, 0, 3.5), (-26.7, 0, 3.5), (-26.7, 0.74, 3.5), (-27.6, 0.74, 3.5)], GREEN)
    cull_face(dr, proj, [(4.0, 0, 9.0), (8.25, 0, 9.0), (8.25, 1.32, 9.0), (4.0, 1.32, 9.0)], (16, 16, 24), CYAN, 2)
    cull_face(dr, proj, [(8.25, 0, 9.0), (8.25, 0, 10.85), (8.25, 1.32, 10.85), (8.25, 1.32, 9.0)], (10, 10, 16))
    # Mural last, so trim and the entrance cannot cover it. Same quad every shot.
    y0, y1 = 3.2, 3.2 + 9.9
    x0, x1 = WALL_X0 + 64.0 * 0.04, WALL_X1 - 64.0 * 0.04
    mz = 0.22
    quad = [proj(x0, y0, mz), proj(x1, y0, mz), proj(x1, y1, mz), proj(x0, y1, mz)]
    paint_mural(dr, quad)
    tier_name = {'street': 'STREET', 'arcade': 'ARCADE', 'onfoot': 'ON FOOT'}[tier]
    bar_h = 54 if h < 500 else 62
    dr.rectangle([0, h - bar_h, w, h], fill=(8, 2, 16))
    dr.text((12, h - bar_h + 6), 'ARCH SHOT  DANCE %s  %s  %s' % (shape.upper(), title, tier_name), fill=(233, 227, 228))
    dr.text((12, h - bar_h + 22), 'Mural wall 64 x 18 m, same facing. Person 1.7 m, car 4.25 m.', fill=(62, 230, 255))
    dr.text((12, h - bar_h + 36), 'Mockup for Architecture Check. Not in the game.', fill=(138, 122, 125))
    return img


# Twelve purposes, two shops each, plus the far-outline skyline. Counts and lots stay.
PURPOSE_SPECS = [
    ('HOME', 'HOME', (125, 255, 107), 44, 11, 20, 'house'),
    ('NEON_PAINT', 'NEON', (255, 79, 216), 44, 14, 18, 'paint'),
    ('GARAGE', 'GARAGE', (255, 176, 32), 48, 15, 24, 'garage'),
    ('DANCE', 'Z COMPANY ARTS', (255, 79, 216), 64, 18, 16, 'dance'),
    ('PETS', 'PETS', (125, 255, 107), 40, 12, 18, 'pets'),
    ('ARCADE', 'ARCADE', (62, 230, 255), 56, 18, 20, 'arcade'),
    ('NOS', 'NOS', (255, 225, 77), 40, 12, 18, 'nos'),
    ('SKY_DROP', 'JUMP', (62, 230, 255), 70, 239, 70, 'sky'),
    ('BUILDER', 'PIXEL', (125, 255, 107), 44, 16, 20, 'builder'),
    ('SOCCER', 'TURBO', (255, 176, 32), 56, 16, 28, 'soccer'),
    ('CAFE', 'PIZZA', (255, 42, 61), 44, 12, 18, 'cafe'),
    ('SHOWROOM', 'Z-DASH', (62, 230, 255), 64, 18, 22, 'show'),
    ('GENERIC', '', (22, 14, 48), 40, 24, 18, 'plain'),
]


def fast_sky(img):
    w, h = img.size
    dr = ImageDraw.Draw(img)
    hy = int(h * 0.62)
    dr.rectangle([0, 0, w, hy], fill=SKY_TOP)
    dr.rectangle([0, int(hy * 0.35), w, hy], fill=SKY_MID)
    dr.rectangle([0, hy, w, h], fill=GROUND)
    dr.line([(0, hy), (w, hy)], fill=HORIZON, width=2)
    return hy


def purpose_cameras(vw, vh, bw, bh, bd):
    focal = (vh * 0.5) / math.tan(math.radians(50) * 0.5)
    dist = max(bw * 0.5 * focal / (0.34 * vw), bh * 0.55 * focal / (0.30 * vh))
    dist = max(16.0, min(140.0, dist))
    eye_y = max(2.2, min(8.0, bh * 0.12))
    # Flying view looks at the roof center, about 38 degrees down, far enough
    # that the whole roof (and a pad on it) stays inside the frame.
    half = 0.5 * math.hypot(bw, bd)
    roof_dist = max(18.0, half / math.tan(math.radians(50 * 0.34)))
    pitch = math.radians(38)
    horiz = roof_dist * math.cos(pitch)
    lift = roof_dist * math.sin(pitch)
    az = math.radians(32)
    rcx, rcz = 0.0, -bd * 0.5
    roof_eye = (rcx + horiz * math.sin(az), bh + lift, rcz + horiz * math.cos(az))
    roof_target = (rcx, bh + 0.2, rcz)
    return {
        'front': ((0.0, eye_y, dist), (0.0, bh * 0.42, 0.0)),
        'threeq': ((dist * 0.72, max(3.0, bh * 0.16), dist * 0.58), (0.0, bh * 0.4, -4.0)),
        'roof': (roof_eye, roof_target),
        'foot': ((-bw * 0.5 + 2.2, 1.65, 6.4), (-bw * 0.5 + 1.4, 2.2, 0.2)),
    }


def roof_pad(dr, proj, bh, bw, bd):
    """Landing pad in world space, on the roof, so a flyover reads as sky drop."""
    cx, cz = 0.0, -bd * 0.5
    r = min(bw, bd) * 0.34
    r = min(r, bw * 0.42 - 1.5, bd * 0.42 - 1.5)
    y = bh + 0.55
    segs = 24
    disc = []
    ring_o = []
    ring_i = []
    for i in range(segs):
        a = math.tau * i / segs
        co, si = math.cos(a), math.sin(a)
        disc.append(proj(cx + co * r * 0.82, y, cz + si * r * 0.82))
        ring_o.append((cx + co * r, y + 0.08, cz + si * r))
        ring_i.append((cx + co * r * 0.82, y + 0.08, cz + si * r * 0.82))
    dr.polygon(disc, fill=(12, 48, 64))
    for i in range(segs):
        j = (i + 1) % segs
        dr.polygon([
            proj(*ring_o[i]), proj(*ring_o[j]), proj(*ring_i[j]), proj(*ring_i[i])
        ], fill=CYAN)
    # H is drawn upright in the frame so the pad still reads as a landing mark
    # when the camera is pitched down. The ring stays in world space on the roof.
    xs = [p[0] for p in disc]
    ys = [p[1] for p in disc]
    hx = sum(xs) / len(xs)
    hy = sum(ys) / len(ys)
    rad = sum(math.hypot(px - hx, py - hy) for px, py in disc) / len(disc)
    arm = rad * 0.72
    t = max(4.0, rad * 0.16)
    dr.rectangle([hx - arm, hy - arm, hx - arm + t, hy + arm], fill=(8, 2, 16))
    dr.rectangle([hx + arm - t, hy - arm, hx + arm, hy + arm], fill=(8, 2, 16))
    dr.rectangle([hx - arm, hy - t * 0.5, hx + arm, hy + t * 0.5], fill=(8, 2, 16))


def win_face(dr, proj, x0, x1, y0, y1, z, tier, color):
    step = 3.6 if tier == 'arcade' else 2.2
    y = y0
    row = 0
    while y < y1 - 1.0:
        if tier == 'arcade' and row % 2:
            y += step * 0.65
            row += 1
            continue
        x = x0
        while x < x1 - 1.0:
            cull_face(dr, proj, [(x, y, z), (x + 0.9, y, z), (x + 0.9, y + 1.2, z), (x, y + 1.2, z)], color)
            x += step
        y += step * 0.7
        row += 1


def draw_purpose(dr, proj, spec, tier):
    pid, sign, color, bw, bh, bd, kind = spec
    x0, x1, zf = -bw / 2.0, bw / 2.0, 0.0
    side = shade(color, 0.72)
    roof_c = shade(color, 0.45)
    # Identity shape. Present in every shot. Surface trim changes with the tier.
    if kind == 'house':
        cull_face(dr, proj, [(x0, 0, zf), (x1, 0, zf), (x1, bh, zf), (x0, bh, zf)], color, None)
        peak = bh + bw * 0.18
        cull_face(dr, proj, [(x0 - 1, bh, zf + 0.4), (x1 + 1, bh, zf + 0.4), (0, peak, zf - bd * 0.5)], (90, 16, 48))
        cull_face(dr, proj, [(x0, 0, zf + 0.2), (x0 + 2.4, 0, zf + 0.2), (x0 + 2.4, 2.2, zf + 0.2), (x0, 2.2, zf + 0.2)], (20, 8, 16), CYAN, 2)
        cull_face(dr, proj, [(x0 + 3.2, 0, zf + 0.2), (x0 + 6.2, 0, zf + 0.2), (x0 + 6.2, 2.3, zf + 0.2), (x0 + 3.2, 2.3, zf + 0.2)], (16, 10, 22), AMBER, 2)
    elif kind == 'garage':
        cull_face(dr, proj, [(x0, 0, zf), (x1, 0, zf), (x1, bh, zf), (x0, bh, zf)], color)
        cull_face(dr, proj, [(-1.8, 0, 0.3), (1.8, 0, 0.3), (1.8, 2.8, 0.3), (-1.8, 2.8, 0.3)], (12, 8, 10), AMBER, 3)
        cull_face(dr, proj, [(-1.5, 0.2, 1.2), (1.5, 0.2, 1.2), (1.5, 1.5, 1.2), (-1.5, 1.5, 1.2)], (16, 16, 24), CYAN, 2)
    elif kind == 'dance':
        cull_face(dr, proj, [(x0, 0, zf), (x1, 0, zf), (x1, bh, zf), (x0, bh, zf)], (36, 12, 32), MAG, 2 if tier == 'arcade' else 4)
        cull_face(dr, proj, [(x0, 0, 0.12), (x0 + 1.2, 0, 0.12), (x0 + 1.2, 2.3, 0.12), (x0, 2.3, 0.12)], (20, 8, 16), CYAN, 2)
    elif kind == 'sky':
        cull_face(dr, proj, [(x0, 0, zf), (x1, 0, zf), (x1, bh, zf), (x0, bh, zf)], color, CYAN, 2)
        cull_face(dr, proj, [(x0 + 6, bh, zf), (x1 - 6, bh, zf), (x1 - 6, bh + 1.2, zf - 4), (x0 + 6, bh + 1.2, zf - 4)], CYAN)
    elif kind == 'builder':
        cull_face(dr, proj, [(x0, 0, zf), (x1, 0, zf), (x1, bh * 0.45, zf), (x0, bh * 0.45, zf)], color)
        cull_face(dr, proj, [(x0 + 4, bh * 0.45, zf - 1), (x1 - 2, bh * 0.45, zf - 1), (x1 - 2, bh * 0.78, zf - 1), (x0 + 4, bh * 0.78, zf - 1)], shade(color, 0.8), AMBER, 2)
        cull_face(dr, proj, [(x0 + 8, bh * 0.78, zf - 2), (x1 - 8, bh * 0.78, zf - 2), (x1 - 8, bh, zf - 2), (x0 + 8, bh, zf - 2)], shade(color, 0.6), CYAN, 2)
    elif kind == 'soccer':
        cull_face(dr, proj, [(x0, 0, zf), (x1, 0, zf), (x1, bh * 0.35, zf), (x0, bh * 0.35, zf)], color)
        cull_face(dr, proj, [(x0, bh * 0.35, -2), (x0 + 8, bh * 0.35, -8), (x0 + 8, bh, -8), (x0, bh * 0.55, -2)], shade(color, 0.7))
        cull_face(dr, proj, [(x1, bh * 0.35, -2), (x1 - 8, bh * 0.35, -8), (x1 - 8, bh, -8), (x1, bh * 0.55, -2)], shade(color, 0.55))
        cull_face(dr, proj, [(x0 + 10, 1.2, 0.3), (x1 - 10, 1.2, 0.3), (x1 - 10, bh * 0.32, 0.3), (x0 + 10, bh * 0.32, 0.3)], (20, 40, 24))
    elif kind == 'show':
        cull_face(dr, proj, [(x0, 0, zf), (x1, 0, zf), (x1, bh, zf), (x0, bh, zf)], (28, 16, 48))
        cull_face(dr, proj, [(x0 + 3, 1.2, 0.25), (x1 - 3, 1.2, 0.25), (x1 - 3, bh - 2, 0.25), (x0 + 3, bh - 2, 0.25)], (70, 40, 110), CYAN, 2)
        cull_face(dr, proj, [(-2, 0.2, 1.0), (2.2, 0.2, 1.0), (2.2, 1.5, 1.0), (-2, 1.5, 1.0)], (16, 16, 24), CYAN, 2)
    elif kind == 'plain':
        cull_face(dr, proj, [(x0, 0, zf), (x1, 0, zf), (x1, bh, zf), (x0, bh, zf)], (18, 12, 28))
        win_face(dr, proj, x0 + 3, x1 - 3, 3, bh - 3, 0.15, 'arcade', (40, 28, 64))
    elif kind == 'wash':
        cull_face(dr, proj, [(x0, 0, zf), (x0 + 6, 0, zf), (x0 + 6, bh, zf), (x0, bh, zf)], color, CYAN, 2)
        cull_face(dr, proj, [(x1 - 6, 0, zf), (x1, 0, zf), (x1, bh, zf), (x1 - 6, bh, zf)], color, CYAN, 2)
        cull_face(dr, proj, [(x0, bh - 1.4, zf), (x1, bh - 1.4, zf), (x1, bh, zf), (x0, bh, zf)], CYAN)
        cull_face(dr, proj, [(-1.6, 0, 2.2), (1.6, 0, 2.2), (1.6, 1.4, 2.2), (-1.6, 1.4, 2.2)], (16, 16, 24), CYAN, 2)
    elif kind == 'dock':
        cull_face(dr, proj, [(x0, 0.4, zf), (x1, 0.4, zf), (x1, 1.3, zf - bd), (x0, 1.3, zf - bd)], (24, 48, 64), CYAN, 2)
        for px in (x0 + 4, x1 - 4):
            cull_face(dr, proj, [(px, 0, zf - 2), (px + 1.4, 0, zf - 2), (px + 1.4, 4.2, zf - 2), (px, 4.2, zf - 2)], CYAN)
        cull_face(dr, proj, [(x0 + 8, 1.5, zf - 6), (x0 + 22, 1.5, zf - 6), (x0 + 20, 3.2, zf - 10), (x0 + 10, 3.2, zf - 10)], (255, 79, 216))
    elif kind == 'nook':
        cull_face(dr, proj, [(x0, 0, zf), (x1, 0, zf), (x1, bh, zf), (x0, bh, zf)], color, AMBER, 2)
        peak = bh + bw * 0.16
        cull_face(dr, proj, [(x0 - 1, bh, zf + 0.3), (x1 + 1, bh, zf + 0.3), (0, peak, zf - bd * 0.5)], (90, 16, 48))
        cull_face(dr, proj, [(-4, 2.2, 0.3), (4, 2.2, 0.3), (4, 6.4, 0.3), (-4, 6.4, 0.3)], (255, 225, 77), (20, 8, 16), 2)
    else:
        cull_face(dr, proj, [(x0, 0, zf), (x1, 0, zf), (x1, bh, zf), (x0, bh, zf)], color)
    if kind not in ('house', 'garage', 'dance', 'soccer', 'show', 'plain', 'builder', 'wash', 'dock', 'nook'):
        win_face(dr, proj, x0 + 2, x1 - 2, 3.2, bh - 3.5, 0.12, tier, shade(CYAN, 0.8))
    if kind == 'paint':
        for i, c in enumerate((MAG, CYAN, AMBER, GREEN)):
            cull_face(dr, proj, [(x0 + 3 + i * 4, 3, 0.3), (x0 + 6 + i * 4, 3, 0.3), (x0 + 6 + i * 4, 8, 0.3), (x0 + 3 + i * 4, 8, 0.3)], c)
    if kind == 'pets':
        paw = proj(0, bh * 0.55, 0.3)
        dr.ellipse([paw[0] - 10, paw[1] - 10, paw[0] + 10, paw[1] + 10], fill=GREEN)
    if kind == 'arcade':
        cull_face(dr, proj, [(x0 + 2, bh * 0.62, 0.2), (x1 - 2, bh * 0.62, 0.2), (x1 - 1, bh * 0.62 - 1.2, 2.4), (x0 + 1, bh * 0.62 - 1.2, 2.4)], (20, 8, 28), CYAN, 2)
        win_face(dr, proj, x0 + 4, x1 - 4, bh * 0.66, bh - 2, 0.35, 'street', AMBER)
    if kind == 'nos':
        for ox in (-6, 6):
            cull_face(dr, proj, [(ox - 2, bh, -4), (ox + 2, bh, -4), (ox + 2, bh + 5, -4), (ox - 2, bh + 5, -4)], AMBER, (20, 8, 16), 2)
    if kind == 'cafe':
        cull_face(dr, proj, [(x0 + 1, 3.2, 0.2), (x1 - 1, 3.2, 0.2), (x1 - 0.4, 2.6, 2.6), (x0 + 0.4, 2.6, 2.6)], (255, 42, 61))
    # Side and roof so three-quarter and flying shots have a closed top.
    if kind != 'builder':
        cull_face(dr, proj, [(x1, 0, zf), (x1, 0, zf - bd), (x1, bh, zf - bd), (x1, bh, zf)], side)
        cull_face(dr, proj, [(x0, bh, zf), (x1, bh, zf), (x1, bh, zf - bd), (x0, bh, zf - bd)], roof_c)
    if kind == 'sky':
        roof_pad(dr, proj, bh, bw, bd)
        # Street plaque so the on-foot shot, which cannot see the roof, still reads JUMP.
        cull_face(dr, proj, [(-8, 3.2, 0.4), (8, 3.2, 0.4), (8, 7.4, 0.4), (-8, 7.4, 0.4)], (8, 2, 16), CYAN, 3)
        plaque = [proj(-8, 3.2, 0.45), proj(8, 7.4, 0.45)]
        draw_label(dr, 'JUMP', (plaque[0][0] + plaque[1][0]) / 2, (plaque[0][1] + plaque[1][1]) / 2,
                   abs(plaque[1][0] - plaque[0][0]) * 0.8, abs(plaque[1][1] - plaque[0][1]) * 0.7, CYAN)
    if kind != 'dance' and kind != 'plain':
        if kind == 'sky':
            sy0, sy1 = bh * 0.62, bh * 0.74
            sx0, sx1 = x0 + bw * 0.18, x1 - bw * 0.18
        else:
            sy0, sy1 = bh - 3.2, bh - 1.0
            sx0, sx1 = x0 + 2, x1 - 2
        if sy0 > 3:
            fill = color if tier == 'arcade' else (12, 4, 20)
            outline = CYAN if tier != 'street' else MAG
            cull_face(dr, proj, [(sx0, sy0, 0.35), (sx1, sy0, 0.35), (sx1, sy1, 0.35), (sx0, sy1, 0.35)], fill, outline, 2)
            top = proj(sx0, sy1, 0.45)
            bot = proj(sx1, sy0, 0.45)
            if sign:
                draw_label(dr, sign, (top[0] + bot[0]) / 2, (top[1] + bot[1]) / 2,
                           abs(bot[0] - top[0]) * 0.9, abs(bot[1] - top[1]) * 0.8,
                           CYAN if tier != 'street' else AMBER)
    if tier != 'arcade' and kind not in ('dance', 'cafe', 'arcade'):
        cull_face(dr, proj, [(x0 + 1.5, 2.5, 0.15), (x0 + 4.5, 2.5, 0.15), (x0 + 4.8, 2.2, 1.4), (x0 + 1.2, 2.2, 1.4)], color)
    if kind == 'dance':
        y0, y1 = 3.2, 3.2 + 9.9
        mx0, mx1 = x0 + bw * 0.04, x1 - bw * 0.04
        quad = [proj(mx0, y0, 0.28), proj(mx1, y0, 0.28), proj(mx1, y1, 0.28), proj(mx0, y1, 0.28)]
        paint_mural(dr, quad)
    # Scale: person 1.7 m. Car only where the purpose is the car.
    cull_face(dr, proj, [(-bw / 2 + 3.2, 0, 3.2), (-bw / 2 + 3.7, 0, 3.2), (-bw / 2 + 3.7, 1.7, 3.2), (-bw / 2 + 3.2, 1.7, 3.2)], (233, 227, 228), CYAN, 1)
    if kind in ('garage', 'show', 'house'):
        cull_face(dr, proj, [(2, 0, 8), (6.25, 0, 8), (6.25, 1.32, 8), (2, 1.32, 8)], (16, 16, 24), CYAN, 2)


def purpose_frame(spec, view, tier, vw, vh, title):
    pid = spec[0]
    img = Image.new('RGB', (vw, vh))
    fast_sky(img)
    dr = ImageDraw.Draw(img)
    bw, bh, bd = spec[3], spec[4], spec[5]
    eye, target = purpose_cameras(vw, vh, bw, bh, bd)[view]
    proj = look_proj(vw, vh, eye, target, 50)
    for i in range(-8, 9):
        dr.line([proj(i * 5.0, 0.02, -4), proj(i * 5.0, 0.02, 30)], fill=(48, 18, 58), width=1)
    draw_purpose(dr, proj, spec, tier)
    tier_name = {'street': 'STREET', 'arcade': 'ARCADE', 'onfoot': 'ON FOOT'}[tier]
    chip = pid.replace('_', ' ')
    chip_font = ImageFont.truetype(SIGN_FONT, 18 if vh < 500 else 26)
    chip_bb = chip_font.getbbox(chip)
    chip_w, chip_h = chip_bb[2] - chip_bb[0], chip_bb[3] - chip_bb[1]
    dr.rectangle([12, 12, 28 + chip_w, 22 + chip_h], fill=(8, 2, 16))
    dr.text((20, 16 - chip_bb[1]), chip, fill=CYAN, font=chip_font)
    cap = ImageFont.truetype(SIGN_FONT, 13 if vh < 500 else 16)
    bar_h = 70 if vh < 500 else 82
    dr.rectangle([0, vh - bar_h, vw, vh], fill=(8, 2, 16))
    if pid in ('CAR_WASH', 'RIVER_DOCK', 'STORY_NOOK'):
        sign_line = 'Suggested purpose %s. Not one of the 24.' % (spec[1] or pid)
        foot = 'Idea only. Stays out of the game unless Bob says yes.'
    elif pid == 'SKY_DROP':
        sign_line = 'Sign JUMP. Deck 64x164x62 and tower 70x70x239.'
        foot = 'Look mockup. Footprint matches today. Placement is the City Layout plan.'
    else:
        sign_line = 'Sign %s. Footprint matches today.' % (spec[1] or 'none')
        foot = 'Look mockup. Placement is the City Layout plan.'
    dr.text((12, vh - bar_h + 8), 'PURPOSE  %s    %s    %s' % (pid, title, tier_name), fill=(233, 227, 228), font=cap)
    dr.text((12, vh - bar_h + 30), sign_line, fill=(62, 230, 255), font=cap)
    dr.text((12, vh - bar_h + 52), foot, fill=(138, 122, 125), font=cap)
    return img


IDEA_SPECS = [
    ('CAR_WASH', 'WASH', (62, 230, 255), 32, 8, 16, 'wash'),
    ('RIVER_DOCK', 'DOCK', (62, 230, 255), 64, 6, 16, 'dock'),
    ('STORY_NOOK', 'READ', (125, 255, 107), 28, 11, 18, 'nook'),
]


def write_ideas():
    os.makedirs(ROOT, exist_ok=True)
    os.makedirs(ART, exist_ok=True)
    frames = []
    for spec in IDEA_SPECS:
        img = purpose_frame(spec, 'front', 'street', 1024, 768, 'IDEA')
        leaf = 'idea-%s-front-ipad.png' % spec[0]
        img.save(os.path.join(ROOT, leaf))
        img.save(os.path.join(ART, leaf))
        frames.append(img)
        print(leaf, img.size)
    cell = 240
    gap = 8
    thumbs = [im.resize((int(im.size[0] * cell / im.size[1]), cell), Image.BILINEAR) for im in frames]
    pw = max(th.size[0] for th in thumbs)
    board = Image.new('RGB', (3 * pw + gap * 4, cell + gap * 2), (8, 2, 16))
    for i, th in enumerate(thumbs):
        board.paste(th, (gap + i * (pw + gap), gap))
    path = os.path.join(ROOT, 'idea-sheet.png')
    board.save(path)
    board.save(os.path.join(ART, 'idea-sheet.png'))
    print(path, board.size)


def main():
    os.makedirs(ROOT, exist_ok=True)
    os.makedirs(ART, exist_ok=True)
    made = []
    for kind in ('a', 'b', 'c'):
        for tier in ('arcade', 'street'):
            for name, w, h in VIEWS:
                img = scene(kind, w, h, tier)
                path = os.path.join(ROOT, '%s-%s-%s.png' % (kind, tier, name))
                img.save(path)
                img.save(os.path.join(ART, '%s-%s-%s.png' % (kind, tier, name)))
                made.append(path)
                print(path, img.size)
    for tier in ('arcade', 'street'):
        for name, w, h in VIEWS:
            img = options_scene(tier, w, h)
            path = os.path.join(ROOT, 'dance-options-%s-%s.png' % (tier, name))
            img.save(path)
            img.save(os.path.join(ART, 'dance-options-%s-%s.png' % (tier, name)))
            print(path, img.size)
    # contact sheet: each look, Arcade then Street, iPad frame
    cell_h = 200
    gap = 8
    row_w = []
    thumbs = []
    for kind in ('a', 'b', 'c'):
        for tier in ('arcade', 'street'):
            im = Image.open(os.path.join(ROOT, '%s-%s-ipad.png' % (kind, tier)))
            th = im.resize((int(im.size[0] * cell_h / im.size[1]), cell_h), Image.BILINEAR)
            thumbs.append([th])
            row_w.append(th.size[0] + gap)
    sheet = Image.new('RGB', (max(row_w) + gap, cell_h * len(thumbs) + gap * (len(thumbs) + 1)), (8, 2, 16))
    y = gap
    for row in thumbs:
        x = gap
        for th in row:
            sheet.paste(th, (x, y))
            x += th.size[0] + gap
        y += cell_h + gap
    sheet_path = os.path.join(ROOT, 'sheet.png')
    sheet.save(sheet_path)
    sheet.save(os.path.join(ART, 'sheet.png'))
    print(sheet_path, sheet.size)
    # Dance shape options: Arcade over Street, iPad frame.
    opt_thumbs = []
    opt_w = []
    for tier in ('arcade', 'street'):
        im = Image.open(os.path.join(ROOT, 'dance-options-%s-ipad.png' % tier))
        th = im.resize((int(im.size[0] * cell_h / im.size[1]), cell_h), Image.BILINEAR)
        opt_thumbs.append(th)
        opt_w.append(th.size[0])
    opt = Image.new('RGB', (max(opt_w) + gap * 2, cell_h * 2 + gap * 3), (8, 2, 16))
    yy = gap
    for th in opt_thumbs:
        opt.paste(th, (gap, yy))
        yy += cell_h + gap
    opt_path = os.path.join(ROOT, 'dance-options-sheet.png')
    opt.save(opt_path)
    opt.save(os.path.join(ART, 'dance-options-sheet.png'))
    print(opt_path, opt.size)
    shot_dir = os.path.join(os.path.dirname(__file__), '..', 'test-results', 'arch-check', 'shots')
    art_shots = '/opt/cursor/artifacts/arch-check/shots'
    os.makedirs(shot_dir, exist_ok=True)
    os.makedirs(art_shots, exist_ok=True)
    ipad_frames = []
    for shape in ('box', 'shoulder', 'crown'):
        row = []
        for view, tier, title in REVIEW_SHOTS:
            for name, vw, vh in REVIEW_VIEWS:
                img = review_frame(shape, view, tier, vw, vh, title)
                leaf = 'b-DANCE-%s-%s-%s.png' % (shape, view, name)
                img.save(os.path.join(shot_dir, leaf))
                img.save(os.path.join(art_shots, leaf))
                img.save(os.path.join(ROOT, 'dance-%s-%s-%s.png' % (shape, view, name)))
                img.save(os.path.join(ART, 'dance-%s-%s-%s.png' % (shape, view, name)))
                print(leaf, img.size)
                if name == 'ipad':
                    row.append(img)
        ipad_frames.append(row)
    cell_h = 170
    gap = 6
    thumbs = []
    for row in ipad_frames:
        thumbs.append([im.resize((int(im.size[0] * cell_h / im.size[1]), cell_h), Image.BILINEAR) for im in row])
    sheet_w = sum(th.size[0] for th in thumbs[0]) + gap * (len(thumbs[0]) + 1)
    sheet_h = cell_h * len(thumbs) + gap * (len(thumbs) + 1)
    board = Image.new('RGB', (sheet_w, sheet_h), (8, 2, 16))
    yy = gap
    for row in thumbs:
        xx = gap
        for th in row:
            board.paste(th, (xx, yy))
            xx += th.size[0] + gap
        yy += cell_h + gap
    board_path = os.path.join(ROOT, 'dance-review-sheet.png')
    board.save(board_path)
    board.save(os.path.join(ART, 'dance-review-sheet.png'))
    board.save(os.path.join(art_shots, 'dance-review-sheet.png'))
    print(board_path, board.size)
    write_purpose(shot_dir, art_shots)


def write_purpose(shot_dir=None, art_shots=None):
    os.makedirs(ROOT, exist_ok=True)
    os.makedirs(ART, exist_ok=True)
    if shot_dir is None:
        shot_dir = os.path.join(os.path.dirname(__file__), '..', 'test-results', 'arch-check', 'shots')
    if art_shots is None:
        art_shots = '/opt/cursor/artifacts/arch-check/shots'
    os.makedirs(shot_dir, exist_ok=True)
    os.makedirs(art_shots, exist_ok=True)
    purpose_dir = shot_dir
    front_row = []
    for spec in PURPOSE_SPECS:
        for view, tier, title in REVIEW_SHOTS:
            for name, vw, vh in REVIEW_VIEWS:
                img = purpose_frame(spec, view, tier, vw, vh, title)
                leaf = 'purpose-%s-%s-%s.png' % (spec[0], view, name)
                img.save(os.path.join(purpose_dir, leaf))
                img.save(os.path.join(art_shots, leaf))
                img.save(os.path.join(ROOT, leaf))
                if view == 'front' and name == 'ipad':
                    front_row.append(img)
                print(leaf, img.size)
    cell = 210
    gap = 6
    cols = 5
    thumbs = [im.resize((int(im.size[0] * cell / im.size[1]), cell), Image.BILINEAR) for im in front_row]
    rows = (len(thumbs) + cols - 1) // cols
    pw = max(th.size[0] for th in thumbs)
    board_w = cols * pw + gap * (cols + 1)
    board_h = rows * cell + gap * (rows + 1)
    lineup = Image.new('RGB', (board_w, board_h), (8, 2, 16))
    for i, th in enumerate(thumbs):
        r, c = divmod(i, cols)
        lineup.paste(th, (gap + c * (pw + gap), gap + r * (cell + gap)))
    lineup_path = os.path.join(ROOT, 'purpose-front-sheet.png')
    lineup.save(lineup_path)
    lineup.save(os.path.join(ART, 'purpose-front-sheet.png'))
    lineup.save(os.path.join(art_shots, 'purpose-front-sheet.png'))
    print(lineup_path, lineup.size)


if __name__ == '__main__':
    if '--ideas' in sys.argv:
        write_ideas()
    elif '--purpose' in sys.argv:
        write_purpose()
    else:
        main()
