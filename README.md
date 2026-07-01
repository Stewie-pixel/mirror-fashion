# Mirror — AI Fashion

A fashion shopping demo with **AI-powered virtual try-on** via [Replicate IDM-VTON](https://replicate.com/cuuupid/idm-vton).

## Features

- Browse curated products and save favorites
- Upload a photo for AI-style search (simulated matching)
- **Virtual try-on** — generates a preview of you wearing select garments using Replicate's IDM-VTON model
- Bag, checkout demo, and profile stats (localStorage)

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A [Replicate](https://replicate.com/) account and API token

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment file and add your Replicate token:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```
   REPLICATE_API_TOKEN=r8_...
   PORT=3000
   ```

3. Start the server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Virtual try-on

Try-on is available for three outerwear products (`p1`, `p3`, `p4`):

1. Upload your photo from the try-on screen or AI search
2. Open a product with try-on enabled and tap **Try it on**
3. The server sends your photo and the garment image to Replicate (~20–30 seconds)
4. The generated preview appears in the try-on stage

**Tips for best results:**

- Use a clear upper-body or full-body portrait
- Prefer a 3:4 aspect ratio; other ratios are auto-cropped
- Garment images live in `assets/` — replace placeholders with flat-lay or on-model product photos for better fidelity

## API

### `POST /api/try-on`

Request:

```json
{
  "userPhoto": "data:image/jpeg;base64,...",
  "productId": "p1"
}
```

Response:

```json
{
  "compositeDataUrl": "data:image/jpeg;base64,...",
  "fitScore": 91,
  "fitTag": "Great match",
  "signals": { "apiGenerated": true }
}
```

## License note

IDM-VTON is licensed **CC BY-NC-SA 4.0 (non-commercial use only)**. This demo is intended for prototyping and evaluation — not for commercial deployment without a different model or license.

## Cost

Replicate charges approximately **$0.024 per try-on run** (varies by input). See [Replicate pricing](https://replicate.com/cuuupid/idm-vton) for current rates.

## Project structure

```
mirror-fashion/
├── assets/           # Garment images for try-on
├── css/
├── js/               # Frontend modules
├── server/           # Express + Replicate proxy
│   ├── index.js
│   ├── products.js
│   └── routes/tryon.js
├── index.html
└── package.json
```
