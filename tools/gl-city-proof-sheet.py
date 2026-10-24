#!/usr/bin/env python3
"""Labeled side-by-side sheets for the boulevard WebGL proof."""
import json
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'test-results', 'gl-city-proof')
ART = '/opt/cursor/artifacts/gl-city-proof'
FONT = '/usr/share/fonts/truetype/macos/Inter-Bold.ttf'
FONT_SM = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'


def font(size, bold=True):
    path = FONT if bold and os.path.exists(FONT) else FONT_SM
    return ImageFont.truetype(path, size)


def channel(a, b):
    pa, pb = a.load(), b.load()
    w, h = a.size
    n = exact = near = hot = 0
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            r1, g1, b1 = pa[x, y]
            r2, g2, b2 = pb[x, y]
            d = abs(r1 - r2) + abs(g1 - g2) + abs(b1 - b2)
            n += 1
            if d == 0:
                exact += 1
            if d <= 12:
                near += 1
            if d > 24:
                hot += 1
    return {
        'exact': round(100 * exact / n, 1),
        'near': round(100 * near / n, 1),
        'hot': round(100 * hot / n, 1),
    }


def zoom_box(im):
    # The car sits in the middle of the frame. The zoom is a building edge
    # up and to the left, so the crop is the wall and not the Z.
    w, h = im.size
    cx, cy = int(w * 0.22), int(h * 0.34)
    hw, hh = max(70, w // 10), max(52, h // 10)
    return cx, cy, hw, hh


def zoom(im, anchor):
    w, h = im.size
    cx, cy, hw, hh = zoom_box(im)
    box = (max(0, cx - hw), max(0, cy - hh), min(w, cx + hw), min(h, cy + hh))
    crop = im.crop(box)
    return crop.resize((crop.width * 3, crop.height * 3), Image.NEAREST)


def sheet(left, right, title, left_label, right_label, footer, anchor):
    gap = 16
    head = 54
    foot = 78
    zw = 420
    zl, zr = zoom(left, anchor), zoom(right, anchor)
    zl.thumbnail((zw, 280), Image.NEAREST)
    zr.thumbnail((zw, 280), Image.NEAREST)
    body_h = max(left.height, right.height)
    zoom_h = max(zl.height, zr.height) + 28
    W = left.width + right.width + gap * 3
    H = head + body_h + zoom_h + foot
    im = Image.new('RGB', (W, H), (8, 6, 16))
    dr = ImageDraw.Draw(im)
    dr.text((16, 12), title, fill=(255, 241, 77), font=font(22))
    im.paste(left, (gap, head))
    im.paste(right, (gap * 2 + left.width, head))
    dr.text((gap, head + body_h + 4), 'ZOOM  ' + left_label, fill=(62, 230, 255), font=font(16))
    dr.text((gap * 2 + left.width, head + body_h + 4), 'ZOOM  ' + right_label, fill=(62, 230, 255), font=font(16))
    zy = head + body_h + 26
    im.paste(zl, (gap, zy))
    im.paste(zr, (gap * 2 + left.width, zy))
    # outline the zoom source on the full frames
    def mark(ox, src):
        cx, cy, hw, hh = zoom_box(src)
        dr.rectangle([ox + cx - hw, head + cy - hh, ox + cx + hw, head + cy + hh], outline=(255, 241, 77), width=3)
    mark(gap, left)
    mark(gap * 2 + left.width, right)
    dr.text((16, H - foot + 8), footer, fill=(232, 236, 244), font=font(15, False))
    return im


def main():
    data = json.load(open(os.path.join(SRC, 'proof.json')))
    rows = data['results']
    by = {}
    for r in rows:
        by[(r['page'], r['viewport'], r['shot'], r['mode'])] = r
    os.makedirs(ART, exist_ok=True)
    made = []
    pages = []
    views = []
    shots = []
    for r in rows:
        if r['page'] not in pages:
            pages.append(r['page'])
        if r['viewport'] not in views:
            views.append(r['viewport'])
        if r['shot'] not in shots:
            shots.append(r['shot'])
    for page in pages:
        for vp in views:
            for shot in shots:
                a = by.get((page, vp, shot, '2d'))
                b = by.get((page, vp, shot, 'gl'))
                if not a or not b:
                    continue
                ia = Image.open(os.path.join(SRC, 'shots', a['file'])).convert('RGB')
                ib = Image.open(os.path.join(SRC, 'shots', b['file'])).convert('RGB')
                stats = channel(ia, ib)
                note = (
                    'Same camera. Exact pixels %s%%. Within a small step %s%%. Visibly different %s%%. '
                    'Nearer walls cover the boost rings. One soft pixel under a neon edge still differs. '
                    'The minimap and the FPS number move between shots. No shadowBlur.'
                    % (stats['exact'], stats['near'], stats['hot'])
                )
                if shot == 'nos':
                    note += ' The colored NOS station is still the 2D painter on both sides, so that building is not a second copy.'
                fps = '2D %sms (~%s fps)   WebGL %sms (~%s fps)   compose %sms   blit %s' % (
                    a['raf'], a['fps'], b['raf'], b['fps'], b['compose'], b['blit'])
                title = '%s  %s  %s     2D canvas  |  WebGL buildings' % (page, vp, shot)
                img = sheet(ia, ib, title, 'today\'s 2D canvas', 'WebGL ?gl=1', note + '   ' + fps, a.get('anchor') or b.get('anchor'))
                name = 'sheet-%s-%s-%s.png' % (page.replace('.html', ''), vp, shot)
                img.save(os.path.join(SRC, name))
                img.save(os.path.join(ART, name))
                made.append({'file': name, 'page': page, 'viewport': vp, 'shot': shot, **stats,
                             'raf2d': a['raf'], 'rafgl': b['raf'], 'fps2d': a['fps'], 'fpsgl': b['fps'],
                             'compose': b['compose'], 'canvas': b.get('canvas')})
                g = by.get((page, vp, 'face', 'glow'))
                if shot == 'face' and g:
                    ig = Image.open(os.path.join(SRC, 'shots', g['file'])).convert('RGB')
                    gst = channel(ia, ig)
                    gnote = (
                        'This wider halo is ?glow=1. It is NOT today\'s picture. Today\'s stroke is a hard edge '
                        '(shadowBlur is 0). Exact %s%%, visibly different %s%%.'
                        % (gst['exact'], gst['hot'])
                    )
                    gimg = sheet(ia, ig, '%s  %s  glow is a different picture' % (page, vp),
                                 'today\'s hard edge', '?glow=1 wider halo', gnote, a.get('anchor'))
                    gname = 'sheet-%s-%s-glow.png' % (page.replace('.html', ''), vp)
                    gimg.save(os.path.join(SRC, gname))
                    gimg.save(os.path.join(ART, gname))
                    made.append({'file': gname, 'page': page, 'viewport': vp, 'shot': 'glow', **gst})
    json.dump({'stamp': data.get('stamp'), 'sheets': made}, open(os.path.join(SRC, 'sheets.json'), 'w'), indent=2)
    print('sheets', len(made))
    for m in made:
        print(m['file'], 'exact', m.get('exact'), 'near', m.get('near'), 'hot', m.get('hot'))


if __name__ == '__main__':
    main()
