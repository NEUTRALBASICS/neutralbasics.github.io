# Neutral Basics

Brand colours: ivory #F3ECDC, deep green #1D423C, sand #D8C9AC, stone #9C8F7A, dark gold #8A6D2F.
Fonts: Cormorant Garamond (headings) and Jost (text). The logo seal is drawn in code.

## Files (upload ALL of them to the same place)

- `index.html`: home page (full-screen hero + two style tiles)
- `collection.html`: the page that shows one style (`collection.html?c=half` or `?c=full`)
- `store.js`: settings (`CONFIG` at the top), cart, WhatsApp order, Google Sheet reading
- `style.css`: all colours and layout
- Your photos: `hero-1.jpg` to `hero-4.jpg`, `tile-half.jpg`, `tile-full.png`, and the product photos

## Add full sleeve (or half sleeve) products in the Google Sheet

Add a column called **Category** to your sheet. Put `Full` on full sleeve rows and `Half` on half sleeve rows.
A row with nothing in Category counts as half sleeve. The sheet changes show on the site within a few minutes.

Columns: `Name, Price, Sizes, Image 1, Image 2, Image 3, Image 4, In_Stock, M Size, L Size, XL Size, Category`

## Settings (top of `store.js`)

- `TILES`: photos for the two home page tiles
- `HERO_IMAGES`, `HERO_IMAGES_MOBILE`, `HERO_FOCUS`, `HERO_SECONDS`: hero slideshow
- `WHATSAPP`, `INSTAGRAM`, `IMAGE_BASE`, `SHEET_CSV_URL`
- Style names are in `CATEGORIES` (just below `CONFIG`)

## Speed tips

Keep every photo under about 300 KB (hero photos about 1920 px wide). Big photos are the main cause of a slow first screen.
Photo file names must match exactly, including capital letters (`.jpg` is not `.JPG`).
