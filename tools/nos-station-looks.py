#!/usr/bin/env python3
"""Two drive-up NOS looks. Not the game.

A BAND is one canopy. It is the recommended prefab.
B TWIN is two wing canopies. It is the other option, not built.
Both use the same footprint math as world/nos-station.js.
"""
import json
import math
import os
import subprocess

from PIL import Image, ImageDraw, ImageFont

import importlib.util

ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT = os.path.join(ROOT, 'test-results', 'gl-city', 'looks')
ART = '/opt/cursor/artifacts/gl-city/looks'
SHOT = os.path.join(ROOT, 'test-results', 'arch-check', 'shots')
ART_SHOT = '/opt/cursor/artifacts/arch-check/shots'
FONT = '/usr/share/fonts/truetype/macos/Inter-Bold.ttf'

GOLD = (255, 225, 77)
GOLD_HI = (255, 244, 176)
CYAN = (62, 230, 255)
CYAN_HI = (210, 255, 255)
MAG = (255, 79, 216)
NAVY = (22, 12, 42)
NAVY_EDGE = (255, 225, 77)
POST = (18, 48, 64)
GLASS = (22, 50, 74)
WHITE = (236, 244, 255)
GROUND = (8, 2, 10)
SKY = (8, 4, 22)

VIEWS = [('phone', 844, 390), ('ipad', 1024, 768), ('pc', 1280, 720)]
CASES = {
    'depot': {'box': {'x0': -32, 'x1': 32, 'z0': 0, 'z1': 164}, 'face': {'nx': 0, 'nz': -1}, 'h': 34},
    'station': {'box': {'x0': 0, 'x1': 40, 'z0': 140, 'z1': 186}, 'face': {'nx': -1, 'nz': 0}, 'h': 12},
}


def layout_for(case):
    spec = CASES[case]
    payload = json.dumps({'box': spec['box'], 'face': spec['face'], 'h': spec['h']})
    script = (
        "const N=require('./world/nos-station.js');"
        "const s=" + payload + ";"
        "process.stdout.write(JSON.stringify(N.layout(s.box,s.face,s.h)));"
    )
    raw = subprocess.check_output(['node', '-e', script], cwd=ROOT)
    return json.loads(raw)


def shade(c, k):
    return tuple(max(0, min(255, int(v * k))) for v in c)


def local_of(origin, x, y, z):
    along = (x - origin['fx']) * origin['tx'] + (z - origin['fz']) * origin['tz']
    inward = (x - origin['fx']) * origin['ix'] + (z - origin['fz']) * origin['iz']
    return along, y, -inward


def part_corners(origin, part):
    pts = []
    for x in (part['x0'], part['x1']):
        for y in (part['y0'], part['y1']):
            for z in (part['z0'], part['z1']):
                pts.append(local_of(origin, x, y, z))
    return pts


def projector(w, h, eye, target, fov=50):
    ex, ey, ez = eye
    fx, fy, fz = target[0] - ex, target[1] - ey, target[2] - ez
    fl = math.hypot(fx, fy, fz) or 1
    fx, fy, fz = fx / fl, fy / fl, fz / fl
    rx, rz = -fz, fx
    rl = math.hypot(rx, rz) or 1
    rx, rz = rx / rl, rz / rl
    ux, uy, uz = 0 * fz - rz * fy, rz * fx - rx * fz, rx * fy - 0 * fx
    focal = (h * 0.5) / math.tan(math.radians(fov) * 0.5)

    def proj(x, y, z):
        dx, dy, dz = x - ex, y - ey, z - ez
        depth = dx * fx + dy * fy + dz * fz
        if depth < 0.35:
            depth = 0.35
        sx = dx * rx + dy * 0 + dz * rz
        sy = dx * ux + dy * uy + dz * uz
        return (w * 0.5 + sx * focal / depth, h * 0.5 - sy * focal / depth, depth)

    return proj


def cameras(w, h, wide, tall):
    focal = (h * 0.5) / math.tan(math.radians(50) * 0.5)
    dist = max(wide * 0.55 * focal / (0.38 * w), tall * 0.7 * focal / (0.32 * h), 18)
    dist = min(dist, 90)
    return {
        'front': ((0, max(2.4, min(6, tall * 0.18)), dist), (0, tall * 0.28, -6)),
        'threeq': ((dist * 0.72, max(3.2, tall * 0.2), dist * 0.62), (0, tall * 0.25, -8)),
        'roof': ((18, tall + 16, 22), (0, tall * 0.35, -10)),
        'foot': ((-4.2, 1.65, 7.2), (-1.2, 1.4, -2.4)),
    }


COLORS = {
    'mass': (NAVY, NAVY_EDGE),
    'canopy': (GOLD, GOLD_HI),
    'glow': (CYAN, CYAN_HI),
    'post': (POST, CYAN),
    'pump': (MAG, GOLD),
    'pumpGold': (GOLD, CYAN),
    'glass': (GLASS, CYAN),
    'wingL': (CYAN, CYAN_HI),
    'wingR': (MAG, (255, 210, 245)),
    'beam': (GOLD, GOLD_HI),
    'car': ((40, 220, 255), CYAN_HI),
    'person': (WHITE, (180, 190, 210)),
}


def faces_of(xs, ys, zs, fill, edge):
    x0, x1 = xs
    y0, y1 = ys
    z0, z1 = zs
    quads = [
        ((x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0)),
        ((x0, y0, z1), (x0, y1, z1), (x1, y1, z1), (x1, y0, z1)),
        ((x0, y0, z0), (x0, y1, z0), (x0, y1, z1), (x0, y0, z1)),
        ((x1, y0, z0), (x1, y0, z1), (x1, y1, z1), (x1, y1, z0)),
        ((x0, y1, z0), (x1, y1, z0), (x1, y1, z1), (x0, y1, z1)),
        ((x0, y0, z0), (x0, y0, z1), (x1, y0, z1), (x1, y0, z0)),
    ]
    out = []
    for q in quads:
        cx = sum(p[0] for p in q) / 4
        cy = sum(p[1] for p in q) / 4
        cz = sum(p[2] for p in q) / 4
        out.append((cz, q, fill, edge))
    return out


def bounds_local(origin, part):
    pts = []
    for x in (part['x0'], part['x1']):
        for y in (part['y0'], part['y1']):
            for z in (part['z0'], part['z1']):
                pts.append(local_of(origin, x, y, z))
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    zs = [p[2] for p in pts]
    return (min(xs), max(xs)), (min(ys), max(ys)), (min(zs), max(zs))


def band_parts(plan):
    origin = plan['origin']
    items = []
    xs, ys, zs = bounds_local(origin, plan['mass'])
    # The depot mass keeps going back. The portrait stops at the station.
    depth_cap = 22 if plan['kind'] == 'depot' else 28
    face_z = max(zs)
    back_z = max(min(zs), face_z - depth_cap)
    items.append(('mass', xs, (0, plan['mass']['y1']), (back_z, face_z)))
    for part in plan['parts']:
        if part['nosPart'] == 'lane':
            continue
        items.append((part['nosPart'],) + bounds_local(origin, part))
    return items


def twin_from(items):
    """Split the one canopy into two wings. Pumps go gold. Same posts and kiosk."""
    out = []
    canopy = None
    pumps = []
    for kind, xs, ys, zs in items:
        if kind == 'canopy':
            canopy = (xs, ys, zs)
            continue
        if kind == 'glow':
            continue
        if kind == 'pump':
            pumps.append((xs, ys, zs))
            continue
        out.append((kind, xs, ys, zs))
    if canopy:
        xs, ys, zs = canopy
        gap = 1.7
        out.append(('wingL', (xs[0], -gap), ys, zs))
        out.append(('wingR', (gap, xs[1]), ys, zs))
        out.append(('beam', (-gap, gap), (ys[1] + 0.12, ys[1] + 0.48), (zs[0] + 0.5, zs[1] - 0.5)))
    for xs, ys, zs in pumps:
        out.append(('pumpGold', xs, (0, 1.15), zs))
    return out


def extras(plan):
    """A 1.7 m person and the car, in the lane, for scale."""
    origin = plan['origin']
    lane = plan['lane']
    cx = (lane['x0'] + lane['x1']) / 2
    cz = (lane['z0'] + lane['z1']) / 2
    # car sits in the lane, nose toward the kiosk (inward)
    ix, iz = origin['ix'], origin['iz']
    tx, tz = origin['tx'], origin['tz']
    # car center a bit toward the street from the lane middle
    wx = cx - ix * 1.2
    wz = cz - iz * 1.2
    half_l, half_w, h = 2.12, 0.92, 1.32
    car = []
    for a in (-half_l, half_l):
        for b in (-half_w, half_w):
            car.append((wx + ix * a + tx * b, wz + iz * a + tz * b))
    # person just left of the lane, at the near pump
    pump = plan['pumps'][0]
    px = pump['x'] + tx * 1.15
    pz = pump['z'] + tz * 1.15
    return car, (px, pz)


def draw_box(bag, xs, ys, zs, fill, edge):
    bag.extend(faces_of(xs, ys, zs, fill, edge))


def render(plan, look, view, vw, vh):
    items = band_parts(plan)
    if look == 'twin':
        items = twin_from(items)
    wide = 16
    tall = plan['mass']['y1']
    eye, target = cameras(vw, vh, wide, tall)[view]
    if plan['kind'] == 'station' and view == 'roof':
        eye = (14, tall + 12, 16)
        target = (0, 3, -6)
    proj = projector(vw, vh, eye, target)
    img = Image.new('RGB', (vw, vh), SKY)
    dr = ImageDraw.Draw(img)
    hy = int(vh * 0.62)
    dr.rectangle([0, hy, vw, vh], fill=GROUND)
    dr.line([(0, hy), (vw, hy)], fill=(255, 42, 61), width=2)
    bag = []
    # ground pad under the canopy
    draw_box(bag, (-9, 9), (0, 0.04), (-12, 1.2), (14, 10, 24), (40, 30, 60))
    for kind, xs, ys, zs in items:
        fill, edge = COLORS.get(kind, (NAVY, GOLD))
        # darken the far mass roof slightly by using the fill as-is
        draw_box(bag, xs, ys, zs, fill, edge)
    car_pts, person = extras(plan)
    origin = plan['origin']
    # car aabb in local
    loc = [local_of(origin, x, 0, z) for x, z in car_pts]
    xs = [p[0] for p in loc]
    zs = [p[2] for p in loc]
    draw_box(bag, (min(xs), max(xs)), (0, 1.32), (min(zs), max(zs)), COLORS['car'][0], COLORS['car'][1])
    px, py, pz = local_of(origin, person[0], 0, person[1])
    draw_box(bag, (px - 0.28, px + 0.28), (0, 1.7), (pz - 0.22, pz + 0.22), WHITE, (180, 190, 210))
    # painter: far first (larger depth)
    painted = []
    for _cz, quad, fill, edge in bag:
        proj_q = [proj(*p) for p in quad]
        depth = sum(p[2] for p in proj_q) / 4
        painted.append((depth, proj_q, fill, edge))
    painted.sort(key=lambda r: -r[0])
    fascia = None
    for depth, poly, fill, edge in painted:
        area = 0
        pts = [(p[0], p[1]) for p in poly]
        for i in range(4):
            x0, y0 = pts[i]
            x1, y1 = pts[(i + 1) % 4]
            area += (x1 - x0) * (y1 + y0)
        if area > 0:
            continue
        dr.polygon(pts, fill=fill)
        dr.line(pts + [pts[0]], fill=edge, width=2)
    sign = None
    for kind, xs, ys, zs in items:
        if kind in ('glow', 'wingL', 'beam'):
            sign = (xs, ys, zs)
            if kind == 'glow':
                break
    if sign:
        xs, ys, zs = sign
        sx, sy, depth = proj((xs[0] + xs[1]) / 2, (ys[0] + ys[1]) / 2, max(zs))
        size = max(14, min(54, int(1100 / max(depth, 6))))
        font = ImageFont.truetype(FONT, size)
        word = 'NOS'
        bb = font.getbbox(word)
        tw, th = bb[2] - bb[0], bb[3] - bb[1]
        dr.text((sx - tw / 2, sy - th / 2), word, font=font, fill=(8, 4, 16) if look == 'band' else GOLD)
    title = 'A BAND  recommended' if look == 'band' else 'B TWIN WINGS'
    size_name = 'DEPOT' if plan['kind'] == 'depot' else 'SMALL STATION'
    cap = '%s  ·  %s  ·  %s' % (title, size_name, view)
    small = ImageFont.truetype(FONT, 16)
    dr.rectangle([0, 0, vw, 28], fill=(8, 2, 16))
    dr.text((10, 4), cap, font=small, fill=GOLD if look == 'band' else CYAN)
    return img


def save(img, name):
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(ART, exist_ok=True)
    os.makedirs(SHOT, exist_ok=True)
    os.makedirs(ART_SHOT, exist_ok=True)
    for folder in (OUT, ART, SHOT, ART_SHOT):
        img.save(os.path.join(folder, name), 'PNG')


def main():
    plans = {k: layout_for(k) for k in CASES}
    sheet_cells = []
    for look in ('band', 'twin'):
        for case, plan in plans.items():
            views = VIEWS if case == 'depot' else (('ipad', 1024, 768),)
            view_names = ('front', 'threeq', 'roof', 'foot') if case == 'depot' else ('front', 'foot', 'roof')
            for view in view_names:
                for size, w, h in views:
                    img = render(plan, look, view, w, h)
                    save(img, 'nos-%s-%s-%s-%s.png' % (look, case, view, size))
                    if view == 'front' and size == 'ipad':
                        sheet_cells.append(img.resize((480, 360)))
    sheet = Image.new('RGB', (980, 760), (8, 2, 16))
    dr = ImageDraw.Draw(sheet)
    font = ImageFont.truetype(FONT, 18)
    labels = ['A BAND depot — recommended', 'A BAND small station — recommended', 'B TWIN depot', 'B TWIN small station']
    for i, cell in enumerate(sheet_cells):
        x, y = (i % 2) * 490 + 8, (i // 2) * 370 + 28
        sheet.paste(cell, (x, y))
        dr.text((x, y - 22), labels[i], font=font, fill=GOLD if i < 2 else CYAN)
    save(sheet, 'nos-options-sheet.png')
    print('wrote nos looks', len(sheet_cells))


if __name__ == '__main__':
    main()
