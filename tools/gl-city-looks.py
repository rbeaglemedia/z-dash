#!/usr/bin/env python3
"""Proposal mockups for the building-look hold. Not the game. No model files."""
import math
import os
from PIL import Image, ImageDraw

ROOT = os.path.join(os.path.dirname(__file__), '..', 'test-results', 'gl-city', 'looks')
ART = '/opt/cursor/artifacts/gl-city/looks'

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
    dr.text((label[0] - (54 if span > 160 else 22), label[1] - 6), word, fill=CYAN)
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


if __name__ == '__main__':
    main()
