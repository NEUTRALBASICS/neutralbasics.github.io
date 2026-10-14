# Neutral Basics

Brand colours: ivory #F3ECDC, deep green #1D423C, sand #D8C9AC, stone #9C8F7A, dark gold #8A6D2F.
Fonts: Cormorant Garamond (headings) and Jost (text). The logo seal is drawn in code.

## Files (upload ALL of them to the same place)

- `index.html`: home page (full-screen hero + three style tiles)
- `collection.html`: the page that shows one style (`collection.html?c=half`, `?c=full` or `?c=plain`)
- `store.js`: settings (`CONFIG` at the top), cart, WhatsApp order, size chart popup, Google Sheet reading
- `style.css`: all colours and layout
- Your photos: `hero-1.jpg` to `hero-4.jpg`, `tile-half.jpg`, `tile-full.png`, `tile-plain.jpg`, and the product photos

## Google Sheet columns

`Name, Price, Sizes, Image 1, Image 2, Image 3, Image 4, In_Stock, M Size, L Size, XL Size, Category, Size Chart`

### Category (which style page a product appears on)
- `Half`: Oversized Tees (Half Sleeve). An empty cell also counts as Half.
- `Full`: Boxy Fit (Full Sleeve)
- `Plain`: Acid Wash Plain Tees (Oversized)

### Size Chart (optional, one cell per product)
Every product card has a "Size chart" link that opens a popup. Until a chart is added, it says "coming soon" with a WhatsApp button.

Two ways to fill the cell:

1. Type the measurements (one size after another, separated by `;`):
   `M=Chest 40 in, Length 27 in, Shoulder 18 in; L=Chest 42 in, Length 28 in, Shoulder 19 in; XL=Chest 44 in, Length 29 in, Shoulder 20 in`
   The site turns this into a table. Use any measurement names you like (Chest, Length, Shoulder, Sleeve...).
2. Or type the file name of a size chart picture saved next to `index.html`, for example `size-chart-oversized.jpg`.

If every product in a style uses the same chart, you can paste it once in `store.js` under `SIZE_CHARTS` (half / full / plain) instead of in every row. A product's own cell overrides it.

## Settings (top of `store.js`)

- `INSTAGRAM`: your handle without @ (shows in the header and footer)
- `TILES`: photos for the home page tiles
- `HERO_IMAGES`, `HERO_IMAGES_MOBILE`, `HERO_FOCUS`, `HERO_SECONDS`: hero slideshow
- `WHATSAPP`, `IMAGE_BASE`, `SHEET_CSV_URL`, `SIZE_CHARTS`
- Style names are in `CATEGORIES` (just below `CONFIG`)

## Speed tips

Keep every photo under about 300 KB (hero photos about 1920 px wide). Big photos are the main cause of a slow first screen.
Photo file names must match exactly, including capital letters (`.jpg` is not `.JPG`).
