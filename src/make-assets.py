"""Rebuild assets/*.webp from the user's Luo Tianyi illustration set.

    python src/make-assets.py

The source illustrations are NOT shipped with this package: point RAW at a
folder that holds the original files (kept out of the repository for size and
licensing reasons). Each asset keeps the exact crop reviewed for the skin:

  wallpaper-dark      the same 云端城堡 as daylight, at night (starry sky), so
                      the two themes are a matched pair.
  wallpaper-light     cloud-castle azure sky.
  sidebar-portrait-dark  bust crop at the foot of the sidebar; both themes use
                      it, the light profile just lowers its alpha.
  avatar              chibi head, whole silhouette so it reads at 28 px.
  sidebar-ambience*   heavily blurred fields used as the sidebar glow.
"""
import os
from PIL import Image, ImageFilter, ImageEnhance

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, '..', 'assets')
RAW = os.environ.get('TIANYI_RAW', os.path.join(HERE, 'raw'))

S = {
    'sky': '109884134_p0.jpg',
    'skyNight': '109884134_p2.jpg',
    'night': '69356478_p0.jpg',
    'chibi': '131999175_p0.jpg',
    'star': '123145707_p0.jpg',
}


def load(key):
    return Image.open(os.path.join(RAW, S[key])).convert('RGB')


def save(img, name, quality=72):
    path = os.path.join(ASSETS, name)
    img.save(path, 'WEBP', quality=quality, method=6)
    print(f'{name:32s} {img.size[0]}x{img.size[1]}  {os.path.getsize(path) / 1000:.1f} KiB')


def crop_to(img, box, size):
    return img.crop(box).resize(size, Image.LANCZOS)


# --- wallpaper -----------------------------------------------------------
# Both themes share one composition: mirrored so she sits right of centre
# where the frame mask is opaque, then cropped and sharpened at 1920 px so
# the window does not have to upscale the wash.
def top_fade(img):
    """Bake the fade under the window chrome into the alpha channel: the
    stylesheet can then mask with a single horizontal gradient, which avoids
    depending on mask-composite support."""
    img = img.convert('RGBA')
    width, height = img.size
    clear = round(height * 0.055)
    full = round(height * 0.26)
    ramp = Image.new('L', (1, height))
    px = ramp.load()
    for y in range(height):
        if y <= clear:
            value = 0.0
        elif y >= full:
            value = 1.0
        else:
            t = (y - clear) / (full - clear)
            value = t * t * (3 - 2 * t)
        px[0, y] = round(max(0.0, min(1.0, value)) * 255)
    img.putalpha(ramp.resize((width, height)))
    return img


def art(key, quality):
    img = load(key).transpose(Image.FLIP_LEFT_RIGHT)
    img = crop_to(img, (120, 0, 2617, 1561), (1920, 1200))
    img = img.filter(ImageFilter.UnsharpMask(radius=1.6, percent=160, threshold=2))
    return top_fade(img), quality


night, q = art('skyNight', 70)
save(night, 'wallpaper-dark.webp', quality=q)

day, q = art('sky', 70)
save(day, 'wallpaper-light.webp', quality=q)

# --- sidebar portraits ---------------------------------------------------
save(load('night').resize((900, 1140), Image.LANCZOS), 'sidebar-portrait-dark.webp', quality=76)

# --- avatar --------------------------------------------------------------
save(crop_to(load('chibi'), (150, 40, 1650, 1540), (512, 512)), 'avatar.webp', quality=80)

# --- sidebar glow --------------------------------------------------------
# A blurred, saturated night-blue field: enough structure to read as a stage
# light behind the session list, not enough to compete with it.
glow = crop_to(load('star'), (150, 350, 1250, 1550), (560, 620))
glow = glow.filter(ImageFilter.GaussianBlur(34))
glow = ImageEnhance.Color(glow).enhance(1.9)
glow = ImageEnhance.Brightness(glow).enhance(1.25)
save(glow, 'sidebar-ambience.webp', quality=80)

# The light theme gets a daylight glow instead: the same night field over
# white reads as a grey-blue stain.
glow_day = crop_to(load('sky'), (300, 0, 1500, 1200), (560, 620))
glow_day = glow_day.filter(ImageFilter.GaussianBlur(40))
glow_day = ImageEnhance.Color(glow_day).enhance(1.35)
glow_day = ImageEnhance.Brightness(glow_day).enhance(1.08)
save(glow_day, 'sidebar-ambience-light.webp', quality=80)
