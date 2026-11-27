#!/usr/bin/env python3
"""
Renders the looping login background video: a quiet city map with a few vehicles driving their
routes (red, blue, green, amber), one clip for light mode and one for dark mode, in landscape
(website) and portrait (app). Seamless loop, no audio, small files.

  python3 tools/auth-video/render.py          # writes web/public/video/*.mp4 and mobile/assets/video/*.mp4

Needs: ffmpeg, Pillow. The look matches the app: ink, white and one red accent.
"""
import math, os, random, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
FONT = os.path.join(ROOT, 'web', 'public', 'fonts', 'DMMono_500Medium.ttf')
SS = 2            # draw at 2x, then shrink: smooth edges
FPS = 24
SECONDS = 10
FRAMES = FPS * SECONDS

THEMES = {
    'light': dict(bg=(244, 244, 245), block=(235, 235, 238), road=(255, 255, 255), casing=(221, 221, 226), park=(224, 238, 223), water=(212, 227, 238), chip=(255, 255, 255), ink=(32, 32, 32)),
    'dark': dict(bg=(20, 20, 22), block=(28, 28, 31), road=(46, 46, 51), casing=(35, 35, 39), park=(27, 40, 31), water=(24, 34, 46), chip=(42, 42, 46), ink=(240, 240, 240)),
}
COLORS = [(217, 54, 54), (47, 100, 168), (31, 138, 85), (194, 116, 0)]


def chaikin(pts, n=3):
    for _ in range(n):
        out = []
        for i in range(len(pts)):
            a, b = pts[i], pts[(i + 1) % len(pts)]
            out += [(0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]), (0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1])]
        pts = out
    return pts


class Path:
    def __init__(self, pts):
        self.pts = pts + [pts[0]]
        self.cum = [0.0]
        for i in range(1, len(self.pts)):
            self.cum.append(self.cum[-1] + math.dist(self.pts[i - 1], self.pts[i]))
        self.length = self.cum[-1]

    def at(self, s):
        d = (s % 1.0) * self.length
        lo, hi = 0, len(self.cum) - 1
        while lo < hi - 1:
            mid = (lo + hi) // 2
            if self.cum[mid] <= d: lo = mid
            else: hi = mid
        seg = self.cum[lo + 1] - self.cum[lo] or 1
        f = (d - self.cum[lo]) / seg
        a, b = self.pts[lo], self.pts[lo + 1]
        return (a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f)

    def trail(self, s, frac, n=40):
        return [self.at(s - frac * (1 - i / (n - 1))) for i in range(n)]


def render(w, h, mode, out):
    th = THEMES[mode]
    rnd = random.Random(7)
    big = max(w, h) * SS
    margin = int(0.09 * big)
    W, H = w * SS, h * SS
    WW, WH = W + 2 * margin, H + 2 * margin
    G = 0.115 * big

    def gaps(total):
        v, out = [0.0], 0.0
        while out < total:
            out += G * rnd.uniform(0.8, 1.3); v.append(out)
        return v
    xs, ys = gaps(WW), gaps(WH)
    rw = G * 0.17  # road width

    world = Image.new('RGB', (WW, WH), th['bg'])
    d = ImageDraw.Draw(world)
    # blocks (some parks and one water body)
    for i in range(len(xs) - 1):
        for j in range(len(ys) - 1):
            x0, x1, y0, y1 = xs[i] + rw / 2, xs[i + 1] - rw / 2, ys[j] + rw / 2, ys[j + 1] - rw / 2
            r = rnd.random()
            col = th['park'] if r < 0.11 else th['water'] if r < 0.14 else th['block']
            d.rounded_rectangle((x0, y0, x1, y1), radius=G * 0.05, fill=col)
    # roads: grid + two avenues + a ring road
    roads = [[(x, 0), (x, WH)] for x in xs] + [[(0, y), (WW, y)] for y in ys]
    avenues = [[(0, WH * 0.15), (WW, WH * 0.85)], [(0, WH * 0.9), (WW, WH * 0.1)]]
    cx, cy, rr = WW / 2, WH / 2, 0.30 * big
    ring = [(cx + rr * math.cos(a / 90 * math.pi), cy + rr * 0.78 * math.sin(a / 90 * math.pi)) for a in range(181)]
    for width, col in ((rw * 1.25, th['casing']), (rw, th['road'])):
        for line in roads: d.line(line, fill=col, width=int(width))
    for width, col in ((rw * 1.9, th['casing']), (rw * 1.5, th['road'])):
        for line in avenues: d.line(line, fill=col, width=int(width))
        d.line(ring, fill=col, width=int(width), joint='curve')

    # routes along the grid
    def gp(i, j): return (xs[i % len(xs)], ys[j % len(ys)])
    ci, cj = len(xs) // 2, len(ys) // 2
    shapes = [
        [gp(ci - 3, cj - 2), gp(ci + 1, cj - 2), gp(ci + 1, cj - 1), gp(ci + 3, cj - 1), gp(ci + 3, cj + 1), gp(ci - 1, cj + 1), gp(ci - 1, cj), gp(ci - 3, cj)],
        [gp(ci - 4, cj + 1), gp(ci - 4, cj + 3), gp(ci, cj + 3), gp(ci, cj + 2), gp(ci + 2, cj + 2), gp(ci + 2, cj + 1), gp(ci - 2, cj + 1), gp(ci - 2, cj + 1)],
        [gp(ci + 2, cj - 4), gp(ci + 5, cj - 4), gp(ci + 5, cj - 2), gp(ci + 4, cj - 2), gp(ci + 4, cj - 3), gp(ci + 2, cj - 3)],
        ring[::6],
    ]
    shapes[1] = [p for k, p in enumerate(shapes[1]) if k == 0 or p != shapes[1][k - 1]][:-1] or shapes[1]
    paths = [Path(chaikin(s, 3 if k < 3 else 1)) for k, s in enumerate(shapes)]
    speeds = [1, 1, 2, 1]
    offsets = [0.0, 0.35, 0.6, 0.15]
    plates = ['TN 38 BX 4521', None, 'TN 66 AF 9032', None]
    font = ImageFont.truetype(FONT, int(G * 0.105)) if os.path.exists(FONT) else ImageFont.load_default()

    proc = subprocess.Popen(
        ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{w}x{h}', '-r', str(FPS), '-i', '-',
         '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '31', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out],
        stdin=subprocess.PIPE)
    for f in range(FRAMES):
        t = f / FRAMES
        # slow drifting camera, seamless over the loop
        ox = int(margin + 0.55 * margin * math.sin(2 * math.pi * t))
        oy = int(margin + 0.4 * margin * math.cos(2 * math.pi * t))
        frame = world.crop((ox, oy, ox + W, oy + H)).convert('RGBA')
        ov = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        o = ImageDraw.Draw(ov)
        for k, p in enumerate(paths):
            col = COLORS[k]
            s = offsets[k] + speeds[k] * t
            # whole route, faint
            o.line([(x - ox, y - oy) for x, y in p.pts], fill=col + (70,), width=int(rw * 0.42), joint='curve')
            # the part just driven, strong
            tr = [(x - ox, y - oy) for x, y in p.trail(s, 0.16)]
            o.line(tr, fill=col + (235,), width=int(rw * 0.55), joint='curve')
        for k, p in enumerate(paths):
            col = COLORS[k]
            x, y = p.at(offsets[k] + speeds[k] * t)
            x, y = x - ox, y - oy
            pulse = 0.5 + 0.5 * math.sin(2 * math.pi * (t * 2 + k * 0.25))
            hr = rw * (1.0 + 1.4 * pulse)
            o.ellipse((x - hr, y - hr, x + hr, y + hr), fill=col + (int(70 * (1 - pulse)) + 18,))
            r1, r2 = rw * 0.62, rw * 0.40
            o.ellipse((x - r1, y - r1, x + r1, y + r1), fill=(255, 255, 255, 255))
            o.ellipse((x - r2, y - r2, x + r2, y + r2), fill=col + (255,))
            if plates[k]:
                tw = o.textlength(plates[k], font=font)
                pad = rw * 0.38
                bx0, by0 = x + r1 + rw * 0.35, y - rw * 1.55
                o.rounded_rectangle((bx0, by0, bx0 + tw + pad * 3.2, by0 + rw * 0.95), radius=rw * 0.3, fill=th['chip'] + (245,))
                o.ellipse((bx0 + pad * 0.8, by0 + rw * 0.33, bx0 + pad * 0.8 + rw * 0.3, by0 + rw * 0.63), fill=col + (255,))
                o.text((bx0 + pad * 2.0, by0 + rw * 0.47), plates[k], font=font, fill=th['ink'] + (255,), anchor='lm')
        frame = Image.alpha_composite(frame, ov).convert('RGB').resize((w, h), Image.LANCZOS)
        proc.stdin.write(frame.tobytes())
    proc.stdin.close()
    proc.wait()
    print('wrote', out, os.path.getsize(out) // 1024, 'KB')


if __name__ == '__main__':
    jobs = [
        ('web/public/video', 1280, 720), ('mobile/assets/video', 720, 1280),
    ]
    only = sys.argv[1:] or None
    for folder, w, h in jobs:
        os.makedirs(os.path.join(ROOT, folder), exist_ok=True)
        for mode in ('light', 'dark'):
            name = f'auth-{mode}.mp4'
            if only and name not in only and folder not in only: continue
            render(w, h, mode, os.path.join(ROOT, folder, name))
