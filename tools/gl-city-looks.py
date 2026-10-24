#!/usr/bin/env python3
"""Proposal mockups for the building-look hold. Not the game. No model files."""
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


def dance(dr, proj, tier, kind):
    # Z Company Arts. One rectangle in both tiers. The mural quad does not move.
    x, z, w, d, h = 6, -6, 12, 5, 10
    wall = (36, 12, 32) if kind != 'b' else (196, 150, 148)
    box(dr, proj, x, z, w, d, h, 'glass' if kind != 'b' else 'pastel')
    front = [proj(x, 0, z + 0.05), proj(x + w, 0, z + 0.05),
             proj(x + w, h, z + 0.05), proj(x, h, z + 0.05)]
    dr.polygon(front, fill=wall)
    # Same fractions muralFrame uses on the 18 m Arts box: y0 3.2, height 9.9, 92% of the face.
    y0 = h * (3.2 / 18.0)
    y1 = h * ((3.2 + 9.9) / 18.0)
    x0 = x + w * 0.04
    x1 = x + w * 0.96
    mz = z + 0.12
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
    dr.ellipse([head[0] - 5, head[1] - 5, head[0] + 5, head[1] + 5], outline=MAG, width=2)
    band = [mpt(0.02, 0.86), mpt(0.98, 0.86), mpt(0.98, 0.98), mpt(0.02, 0.98)]
    dr.polygon(band, fill=(6, 2, 16))
    dr.line(band + [band[0]], fill=CYAN, width=2)
    label = mpt(0.50, 0.92)
    dr.text((label[0] - 52, label[1] - 6), 'Z COMPANY ARTS', fill=CYAN)
    dr.line(mural + [mural[0]], fill=MAG, width=3)
    # Trim, sign, and entrance sit outside the mural quad.
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
    # Entrance on the side wall, clear of the mural face.
    side = [proj(x - 0.05, 0, z + 0.4), proj(x - 0.05, 0, z + 1.8),
            proj(x - 0.05, h * 0.28, z + 1.8), proj(x - 0.05, h * 0.28, z + 0.4)]
    dr.polygon(side, fill=(20, 8, 16))
    dr.line(side + [side[0]], fill=CYAN, width=2)
    if tier == 'street':
        # Side-wall awning only. It does not cross the mural face.
        y = h * 0.32
        lip = [proj(x, y, z + 0.25), proj(x, y, z + 1.95),
               proj(x - 1.5, y - 0.35, z + 2.05), proj(x - 1.5, y - 0.35, z + 0.15)]
        dr.polygon(lip, fill=MAG)
        dr.line(lip + [lip[0]], fill=MAG, width=2)


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
    # The Z dance rectangle is drawn after these so its flat mural face stays whole.
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
    dance(dr, proj, tier, kind)
    titles = {
        'a': '(a) procedural',
        'b': '(b) free kit palette',
        'c': '(c) hybrid',
    }
    tier_name = 'ARCADE  lighter windows, static roof' if tier == 'arcade' else 'STREET  same shape, storefronts on'
    bar_h = 54 if h < 500 else 62
    dr.rectangle([0, h - bar_h, w, h], fill=(8, 2, 16))
    dr.text((12, h - bar_h + 6), 'MOCKUP  ' + titles[kind] + '   ' + tier_name, fill=(233, 227, 228))
    dr.text((12, h - bar_h + 22), MS[(kind, tier)] + '   building pass only, not measured on a phone', fill=(62, 230, 255))
    dr.text((12, h - bar_h + 36), 'Z DANCE wall stays flat. Mural matches both tiers.', fill=(138, 122, 125))
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


if __name__ == '__main__':
    main()
