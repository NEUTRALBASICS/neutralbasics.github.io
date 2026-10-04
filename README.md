# Neutral Basics

Brand colours used on the site: ivory #F3ECDC, deep green #1D423C, sand #D8C9AC, stone #9C8F7A, dark gold #8A6D2F. Fonts: Cormorant Garamond (headings, wordmark) and Jost (text). The logo seal is drawn in code (header, footer, browser tab icon, photo placeholders), so no logo file is needed.

Static storefront. Nothing more. Nothing less.

Cart checkout opens WhatsApp with the order pre-filled, so you confirm every order manually.

## Put it live on GitHub Pages

1. Create a new public repo on GitHub (e.g. `neutral-basics`).
2. Upload `index.html` and this `README.md` (Add file > Upload files).
3. Repo **Settings > Pages**. Under "Build and deployment", pick **Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.
4. After about a minute the site is live at `https://<your-username>.github.io/neutral-basics/`.

## Your Google Sheet

Already connected (published CSV link is in `CONFIG.SHEET_CSV_URL`). Expected columns:

`Name, Price, Sizes, Image 1, Image 2, Image 3, Image 4, In_Stock, M Size, L Size, XL Size`

- `Sizes` separated with `|`, e.g. `M|L|XL`
- `M Size`, `L Size`, `XL Size` = stock count for that size. `0` or `-` shows the size crossed out
- `In_Stock` = `yes` to sell, anything else shows "Sold out"
- Image file names must match the files in the same folder as `index.html` exactly (including capitals). Netlify is case-sensitive. If images are in a subfolder, set `CONFIG.IMAGE_BASE` to `"images/"`.
- Sheet edits show on the site within a few minutes (Google caches published sheets).

## Change the WhatsApp number

Edit `CONFIG.WHATSAPP` in `index.html` (country code plus number, no `+`).

## Homepage hero (full-screen slideshow)

Your photos fill the whole screen and fade from one to the next, with the headline and Shop now button on top.
Save your photos in the same folder as `index.html` named `hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg`, `hero-4.jpg`.
Until they exist, the site shows your product photos instead.

In `CONFIG` in `index.html`:
- `HERO_IMAGES`: the file names (any number, any names).
- `HERO_IMAGES_MOBILE`: optional portrait versions used on phones, e.g. `["hero-m1.jpg","hero-m2.jpg"]`.
- `HERO_FOCUS`: which part stays visible when a photo is cropped (`"center"`, `"top"`, `"center 30%"`).
- `HERO_SECONDS`: seconds per photo.
- `INSTAGRAM`: your handle without `@` (adds a small link in the corner).

Tip: full-screen on a computer is wide, so landscape photos (about 1920 x 1080) fit best. Portrait photos get cropped, so use `HERO_IMAGES_MOBILE` for those.
