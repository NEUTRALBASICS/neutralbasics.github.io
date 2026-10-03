# Neutral Basics

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

## Scroll story intro

The top of the page is a scroll-driven story (4 scenes). In `CONFIG` in `index.html`:
- `SCENES`: four image URLs (product photos work best, portrait 4:5). Blank shows the hanger icon.
- `INSTAGRAM`: your handle without `@`. A small link then stays pinned in the corner.
The headlines are in the `.scene` blocks if you want different wording.
